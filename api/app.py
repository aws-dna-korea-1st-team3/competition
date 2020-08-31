#!/usr/bin/env python3
import os
from aws_cdk import core

from api_cdk.api_cdk_stack import ApiCdkStack

ACCOUNT = os.getenv('CDK_DEFAULT_ACCOUNT', '')
REGION = os.getenv('CDK_DEFAULT_REGION', 'ap-northeast-2')
AWS_ENV = core.Environment(account=ACCOUNT, region=REGION)

app = core.App()
ApiCdkStack(app, "api-cdk", env=AWS_ENV)

app.synth()
