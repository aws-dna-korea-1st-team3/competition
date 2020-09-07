#!/usr/bin/env python3

from aws_cdk import core

from recommendation_frontend.recommendation_frontend_stack import RecommendationFrontendStack

env_TOKYO = core.Environment(region="ap-northeast-1")

app = core.App()
RecommendationFrontendStack(app, "recommendation-frontend", env=env_TOKYO)

app.synth()
