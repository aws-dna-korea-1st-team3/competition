#!/usr/bin/env python3

from aws_cdk import core

from recommendation_frontend.recommendation_frontend_stack import RecommendationFrontendStack

env_SEOUL = core.Environment(region="ap-northeast-2")

app = core.App()
RecommendationFrontendStack(app, "team3-recommendation-frontend", env=env_SEOUL)

app.synth()
