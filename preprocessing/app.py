#!/usr/bin/env python3
import os
from aws_cdk import core

from preprocessing.preprocessing_stack import PreprocessingStack

ACCOUNT = os.getenv("CDK_DEFAULT_ACCOUNT", "")
REGION = os.getenv("CDK_DEFAULT_REGION", "ap-northeast-2")
AWS_ENV = core.Environment(account=ACCOUNT, region=REGION)

app = core.App()
PreprocessingStack(app, "preprocessing", env={'region': 'ap-northeast-2'})

app.synth()
