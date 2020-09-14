from aws_cdk import (
    aws_s3 as _s3,
    aws_glue as glue,
    aws_s3_deployment as s3_deployment,
    aws_iam as iam,
    aws_lambda as _lambda,
    aws_athena as _athena,
    aws_events as _event,
    aws_events_targets as _target,
    core
)
import random

RANDOM_ID = random.randint(1, 10000)
ORIGINAL_DATA_BUCKET_NAME = "dna-preprocessing-webtoon-data-" + str(RANDOM_ID)
TRANSFORMED_DATA_BUCKET_NAME = "dna-preprocessing-webtoon-transformed-data-" + str(RANDOM_ID)
SAMPLE_DATA_DIRECTORY = "data"
TITLE = "title"
USER = "user"
TITLE_READ = "title-read"
GLUE_DATABASE_NAME = "dna_database"
SCHEDULE = "cron(0/5 * * * ? *)"
ATHENA_WORKGROUP = "dna"


class PreprocessingStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        
        s3_org_data = _s3.Bucket(self, ORIGINAL_DATA_BUCKET_NAME, bucket_name=ORIGINAL_DATA_BUCKET_NAME, removal_policy=core.RemovalPolicy.RETAIN)
        s3_transformed_data = _s3.Bucket(self, TRANSFORMED_DATA_BUCKET_NAME, bucket_name=TRANSFORMED_DATA_BUCKET_NAME, removal_policy=core.RemovalPolicy.RETAIN)

        # title-read
        s3_deployment.BucketDeployment(
            self, "s3-deployment-{}".format(TITLE_READ), sources=[s3_deployment.Source.asset("data/{}/".format(TITLE_READ))],
            destination_bucket=s3_org_data,destination_key_prefix="{}/".format(TITLE_READ)
        )
        # title
        s3_deployment.BucketDeployment(
            self, "s3-deployment-{}".format(TITLE), sources=[s3_deployment.Source.asset("data/{}/".format(TITLE))],
            destination_bucket=s3_org_data,destination_key_prefix="{}/".format(TITLE)
        )
        # user
        s3_deployment.BucketDeployment(
            self, "s3-deployment-{}".format(USER), sources=[s3_deployment.Source.asset("data/{}/".format(USER))],
            destination_bucket=s3_org_data,destination_key_prefix="{}/".format(USER)
        )   

        statement = iam.PolicyStatement(actions=["s3:*", "glue:*", "iam:ListRolePolicies", "iam:GetRole", "iam:GetRolePolicy"],
                                        resources=["*"])
        write_to_s3_policy = iam.PolicyDocument(statements=[statement])

        glue_role = iam.Role(
            self, 'GlueCrawlerRole-dna',
            role_name='GlueCrawlerRole-dna',
            inline_policies=[write_to_s3_policy],
            assumed_by=iam.ServicePrincipal('glue.amazonaws.com'),
            managed_policies=[iam.ManagedPolicy.from_aws_managed_policy_name('service-role/AWSGlueServiceRole')]
        )

        #TODO add IAM role for ctas lambda

        dna_database = glue.Database(
            self, "dna-glue-database-id", database_name=GLUE_DATABASE_NAME
        )

        # create glue table
        title_read_table = glue.Table(
            self, "{}-table-id".format(TITLE_READ),
            table_name="{}_table".format(TITLE_READ).replace("-", "_"),
            database=dna_database,
            columns=[
                {"name": "USER_ID", "type": glue.Schema.STRING},
                {"name": "ITEM_ID", "type": glue.Schema.STRING},
                {"name": "TIMESTAMP", "type": glue.Schema.BIG_INT},
                {"name": "TITLE", "type": glue.Schema.STRING},
                {"name": "EVENT_TYPE", "type": glue.Schema.STRING}
            ],
            data_format=glue.DataFormat.CSV,
            bucket=s3_org_data,
            s3_prefix=TITLE_READ
        )

        title_table = glue.Table(
            self, "{}-table-id".format(TITLE),
            table_name="{}_table".format(TITLE).replace("-", "_"),
            database=dna_database,
            columns=[
                {"name": "ITEM_ID", "type": glue.Schema.STRING},
                {"name": "CREATION_TIMESTAMP", "type": glue.Schema.BIG_INT},
                {"name": "TITLE", "type": glue.Schema.STRING},
                {"name": "TAG", "type": glue.Schema.STRING}
            ],
            data_format=glue.DataFormat.CSV,
            bucket=s3_org_data,
            s3_prefix=TITLE
        )

        user_table = glue.Table(
            self, "{}-table-id".format(USER),
            table_name="{}_table".format(USER).replace("-", "_"),
            database=dna_database,
            columns=[
                {"name": "USER_ID", "type": glue.Schema.STRING},
                {"name": "NAME", "type": glue.Schema.STRING},
                {"name": "EMAIL", "type": glue.Schema.STRING},
                {"name": "GENDER", "type": glue.Schema.STRING, "categorical": True},
                {"name": "AGE", "type": glue.Schema.BIG_INT, "categorical": True},
            ],
            data_format=glue.DataFormat.CSV,
            bucket=s3_org_data,
            s3_prefix=USER
        )

        _athena.CfnWorkGroup(
            self, "athena_workgroup_id",
            name=ATHENA_WORKGROUP
        )

        ctas_lambda_trigger = _event.Rule(
            self, "ctas-lambda-trigger-event-id",
            rule_name="ctas-lambda-trigger-event",
            schedule=_event.Schedule.cron(minute="10", hour="*")
        )

        s3_statement = iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            # resources = [s3_bucket.bucket_arn, "{}/*".format(s3_bucket.bucket_arn)],
            resources=["*"],
            actions=[
                "s3:*"
            ]
        )
        athena_statement = iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            resources=["*"],
            actions=[
                "athena:StartQueryExecution",
                "glue:*"
            ]
        )


        ctas_lambda_func = _lambda.Function(
            self, "CTAS_query",
            function_name="CTAS_query",
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.asset("src/lambda"),
            handler="ctas_lambda.lambda_handler",
            description="CTAS query to transform AVRO file, batch execution",
            environment={
                "BUCKET_NAME": s3_transformed_data.bucket_name,
                "DATABASE_NAME": GLUE_DATABASE_NAME,
                "ATHENA_WORKGROUP": ATHENA_WORKGROUP
            },
            timeout=core.Duration.minutes(3)
        )
        ctas_lambda_func.add_to_role_policy(s3_statement)
        ctas_lambda_func.add_to_role_policy(athena_statement)



        ctas_lambda_trigger.add_target(_target.LambdaFunction(ctas_lambda_func))
