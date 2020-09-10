from aws_cdk import (
    aws_s3 as _s3,
    aws_s3_assets,
    aws_glue as glue,
    aws_s3_deployment as s3_deployment,
    aws_iam as iam,
    core
)
import boto3
import random
import os

RANDOM_ID = random.randint(1, 10000)
ORIGINAL_DATA_BUCKET_NAME = "dna-preprocessing-webtoon-data-" + str(RANDOM_ID)
TRANSFORMED_DATA_BUCKET_NAME = "dna-preprocessing-webtoon-transformed-data-" + str(RANDOM_ID)
SAMPLE_DATA_DIRECTORY = "data"
TITLE = "title"
USER = "user"
TITLE_READ = "title-read"


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

        statement = iam.PolicyStatement(actions=["s3:GetObject","s3:PutObject"],
                                        resources=["arn:aws:s3:::{}".format(ORIGINAL_DATA_BUCKET_NAME),
                                                    "arn:aws:s3:::{}".format(TRANSFORMED_DATA_BUCKET_NAME)])
        write_to_s3_policy = iam.PolicyDocument(statements=[statement])

        glue_role = iam.Role(
            self, 'GlueCrawlerRole',
            role_name = 'GlueCrawlerRole',
            inline_policies=[write_to_s3_policy],
            assumed_by=iam.ServicePrincipal('glue.amazonaws.com'),
            managed_policies=[iam.ManagedPolicy.from_aws_managed_policy_name('service-role/AWSGlueServiceRole')]
        )


        glue_crawler = glue.CfnCrawler(
            self, 'title-read-crawler-id',
            description="Glue Crawler for title-read",
            name='title-read-crawler',
            database_name='units',
            schedule={"scheduleExpression": "cron(5 * * * ? *)"},
            role=glue_role.role_arn,
            targets={"s3Targets": [{"path": "s3://{}/{}/{}.csv".format(ORIGINAL_DATA_BUCKET_NAME, TITLE_READ, TITLE_READ)}]}
        )





    