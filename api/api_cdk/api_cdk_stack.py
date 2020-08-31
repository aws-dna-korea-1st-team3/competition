from aws_cdk import (
    core,
    aws_iam as iam,
    aws_s3 as s3,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_dynamodb as ddb,
    aws_logs
)

from aws_cdk.aws_lambda_event_sources import (
  S3EventSource,
)

class ApiCdkStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        ################################################
        # DynamoDB
        ################################################
        ddb_sims_tbl = ddb.Table(
            self, 'RecommendationSIMS',
            table_name = 'RecommendationSIMS',
            removal_policy = core.RemovalPolicy.DESTROY,
            partition_key={'name': 'itemid', 'type': ddb.AttributeType.STRING},
            billing_mode=ddb.BillingMode.PROVISIONED,
            read_capacity=5,
            write_capacity=50
        )

        ddb_sims_tbl_rw_policy_statement = iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            resources=[ddb_sims_tbl.table_arn],
            actions=[
                "dynamodb:BatchGetItem",
                "dynamodb:Describe*",
                "dynamodb:List*",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:DeleteItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem"
            ]
        )

        ################################################
        # Lambda + S3
        ################################################
        ddb_lambda_fn = _lambda.Function(self, 'UpsertManhwakyungToDynmodbDB',
            function_name='UpsertManhwakyungToDynmodbDB',
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.asset('src/lambda/UpsertManhwakyungToDynmodbDB'),
            handler='manhwakyung_s3_to_dynamodb.lambda_handler',
            description='Store recommendation results in dynamoDB (Recipe: SIMS)',
            environment={
                'REGION_NAME': kwargs['env'].region,
                'DDB_SIMS_TABLE': ddb_sims_tbl.table_name
            },
            timeout=core.Duration.minutes(1)
        )

        s3_bucket = s3.Bucket(self, "s3bucket",
            #removal_policy=core.RemovalPolicy.DESTROY,
            bucket_name="team3-recommendation-system-personalize-data-jhhwang-cdk")

        # https://stackoverflow.com/questions/60087302/how-to-add-resource-policy-to-existing-s3-bucket-with-cdk-in-javascript
        # https://stackoverflow.com/questions/60282173/lookup-s3-bucket-and-add-a-trigger-to-invoke-a-lambda
        #s3_bucket = s3.Bucket.from_bucket_name(self, "ExistingBucket",
        #    bucket_name="team3-recommendation-system-personalize-data-jhhwang-cdk")
       
        s3_event_filter = s3.NotificationKeyFilter(prefix="results/by-title-id/", suffix=".out")
        s3_event_source = S3EventSource(s3_bucket, events=[s3.EventType.OBJECT_CREATED_PUT], filters=[s3_event_filter])
        ddb_lambda_fn.add_event_source(s3_event_source)

        s3_read_statement = iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            #resources = [s3_bucket.bucket_arn, "{}/*".format(s3_bucket.bucket_arn)],
            resources = ["*"],
            actions=[
                "s3:Get*",
                "s3:List*"
            ]
        )

        ddb_lambda_fn.add_to_role_policy(s3_read_statement)
        ddb_lambda_fn.add_to_role_policy(ddb_sims_tbl_rw_policy_statement)

        ##############################################################
        # APIGW + Lambda
        ##############################################################
        sims_title_lambda_fn = _lambda.Function(self, 'RecommendSimsByTitleAPI',
            function_name='RecommendSimsByTitleAPI',
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.asset('src/lambda/RecommendSimsByTitleAPI'),
            handler='recommend_sims_by_title.lambda_handler',
            description='API to provide recommended results (Recipe: SIMS)',
            environment={
                'REGION_NAME': kwargs['env'].region,
                'DDB_SIMS_TABLE': ddb_sims_tbl.table_name,
                'DEF_ITEM_LIMIT': "10",
            },
            timeout=core.Duration.minutes(1)
        )
        ddb_sims_tbl.grant_read_write_data(sims_title_lambda_fn)

        sims_title_api = apigw.LambdaRestApi(self, "RecommendSimsByTitle",
            handler=sims_title_lambda_fn,
            proxy=False,
            rest_api_name="RecommendSimsByTitle",
            description='Webtoon is recommended based on webtoon id. (Recipe: SIMS)',
            endpoint_types=[apigw.EndpointType.REGIONAL],
            deploy=True,
            deploy_options=apigw.StageOptions(stage_name="v1")
        )
    
        recomm_titles = sims_title_api.root.add_resource('recommended-titles')
        by_title = recomm_titles.add_resource('by-title')
        by_title.add_method("GET")
        by_title_id= by_title.add_resource('{id}')
        by_title_id.add_method("GET")
