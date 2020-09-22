#!/usr/bin/env python3

PERSISTENT_VALUE_FILE_PATH = '.persistent_values'
REGION='ap-northeast-2'

# S3 관련
BUCKET_NAME = "team3-recommendation-api-data7e2128ca-1gla8bnj0ry2p" # api cdk를 셋업하면서 만들어진 BUCKET_NAME으로 교체
DATA_DIRECTORY = "data"
SEGMENT_PATH = 'data/user/pinpoint'
LAMBDA_PATH = 'data/lambda.zip'

# IAM 관련
S3_BUCKET_POLICY_NAME_FOR_PERSONALIZE = 'CompetitionS3BucketPolicyForPersonalize'
S3_POLICY_NAME_FOR_ROLE_FOR_PERSONALIZE = 'CompetitionS3PolicyForRoleForPersonalize'
S3_ROLE_NAME_FOR_PERSONALIZE = 'competition-s3-role-for-personalize'

S3_BUCKET_POLICY_NAME_FOR_PINPOINT = 'CompetitionS3BucketPolicyForPinpoint'
S3_POLICY_NAME_FOR_ROLE_FOR_PINPOINT = 'CompetitionS3PolicyForRoleForPinpoint'
S3_ROLE_NAME_FOR_PINPOINT = 'competition-s3-role-for-pinpoint'

LAMBDA_POLICY_NAME = 'competition-lambda-policy'
LAMBDA_ROLE_NAME = 'competition-lambda-role'

ML_POLICY_NAME = 'CompetitionMlPolicy'
ML_ROLE_NAME = 'competition-ml-role'


# Personalize 관련
TITLE = "title"
USER = "user"
TITLE_READ = "title-read"

TITLE_DATASET = "title-dataset"
USER_DATASET = "user-dataset"
TITLE_READ_DATASET = "title-read-dataset"

DSG = "data-set-group"
DSG_NAME = 'manhwakyung-title-recommendation'

SOLUTION_NAME_SIMS = "manhwakyung-title-recommendation-solution-sims"
SOLUTION_NAME_UP = "manhwakyung-title-recommendation-solution-up"

SOLUTION_SIMS = "solution_sims"
SOLUTION_UP = "solution_up"

SOLUTION_VERSION_SIMS = "solution-version-sims"
SOLUTION_VERSION_UP = "solution-version-up"

FILTER_UP = "filter-up"

CAMPAIGN_NAME_SIMS = "manhwakyung-title-recommendation-campaign-sims"
CAMPAIGN_NAME_UP = "manhwakyung-title-recommendation-campaign-up"

CAMPAIGN_SIMS = 'campaign_sims'
CAMPAIGN_UP = 'campaign_up'


# Lambda 관련
FUNCTION_NAME = 'personalize-pinpoint-lambda'


# Pinpoint 관련
ML_NAME = 'personalize-ml'

APPLICATION_NAME = 'competition-app'
SEGEMENT_NAME = 'competition-segment'
CAMPAIGN_NAME = 'competition-campaign'
EMAIL_NAME = 'competition-email'

ADDRESS = 'dev@myeongjae.kim' # 본인 이메일로 교체

HTML_TEXT = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body> 안녕하세요, {{User.UserId}}님,<div><br></div>
    <div>만화 추천드립니다.<div><br></div>
        <div>1. {{Recommendations.Title.[0]}}</div>
        <div>2. {{Recommendations.Title.[1]}}</div>
        <div>3. {{Recommendations.Title.[2]}}</div>
        <div>4. {{Recommendations.Title.[3]}}</div>
        <div>5. {{Recommendations.Title.[4]}}<br></div>
        <div><br></div>
        <div>DNA 3팀</div>
    </div>
</body>
</html>
'''
