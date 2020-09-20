from aws_cdk import (core, aws_s3 as s3, aws_s3_deployment as s3deploy)


class RecommendationFrontendStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # The code that defines your stack goes here
        bucket = s3.Bucket(
          self,
          "web",
          removal_policy=core.RemovalPolicy.DESTROY,
          public_read_access=True,
          access_control=s3.BucketAccessControl.PUBLIC_READ,
          website_index_document="index.html",
        )
        
        # 웹사이트 업로드
        s3deploy.BucketDeployment(self, "frontend-deploy",
          sources=[s3deploy.Source.asset("../app/out")],
          destination_bucket=bucket,
          destination_key_prefix="/")
        