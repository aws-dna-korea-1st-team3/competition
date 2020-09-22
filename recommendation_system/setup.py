#!/usr/bin/env python3
import logging
import boto3
import os.path
import time
import constant
import util
import asyncio

from botocore.exceptions import ClientError
from constant import PERSISTENT_VALUE_FILE_PATH, REGION, \
                     BUCKET_NAME, DATA_DIRECTORY, SEGMENT_PATH, LAMBDA_PATH, \
                     S3_BUCKET_POLICY_NAME_FOR_PERSONALIZE, S3_POLICY_NAME_FOR_ROLE_FOR_PERSONALIZE, S3_ROLE_NAME_FOR_PERSONALIZE, LAMBDA_POLICY_NAME, LAMBDA_ROLE_NAME, ML_POLICY_NAME, ML_ROLE_NAME, \
                     S3_BUCKET_POLICY_NAME_FOR_PINPOINT, S3_POLICY_NAME_FOR_ROLE_FOR_PINPOINT, S3_ROLE_NAME_FOR_PINPOINT, \
                     TITLE, USER, TITLE_READ, TITLE_DATASET, USER_DATASET, TITLE_READ_DATASET, DSG, DSG_NAME, \
                     SOLUTION_NAME_SIMS, SOLUTION_NAME_UP, SOLUTION_SIMS, SOLUTION_UP, SOLUTION_VERSION_SIMS, SOLUTION_VERSION_UP, FILTER_UP, CAMPAIGN_NAME_SIMS, CAMPAIGN_NAME_UP, CAMPAIGN_SIMS, CAMPAIGN_UP, \
                     FUNCTION_NAME, \
                     ML_NAME, APPLICATION_NAME, SEGEMENT_NAME, CAMPAIGN_NAME, EMAIL_NAME, ADDRESS, HTML_TEXT

from persistent_value import PersistentValues, write

# aws clients
personalize = boto3.client('personalize', region_name=REGION)
personalize_runtime = boto3.client('personalize-runtime', region_name=REGION)

s3 = boto3.client('s3', region_name=REGION)
iam_client = boto3.client('iam', region_name=REGION)
iam_resource = boto3.resource('iam', region_name=REGION)
pinpoint = boto3.client('pinpoint', region_name=REGION)
function = boto3.client('lambda')


# procedures

def get_accountid():
    iam = boto3.resource('iam')
    global ACCOUNT_ID
    ACCOUNT_ID = iam.CurrentUser().arn.split(':')[4]


def create_bucket():
    logging.info('Create bucket. bucket_name: {}, region: {}'.format(BUCKET_NAME, REGION))

    location = {'LocationConstraint': REGION}
    s3.create_bucket(Bucket=BUCKET_NAME,
                     CreateBucketConfiguration=location)


def add_bucket_policy():
    logging.info('Add bucket policy for AWS Personalize. bucket_name: {}'.format(BUCKET_NAME))

    policy = f'''{{
"Version": "2012-10-17",
"Id": "{S3_BUCKET_POLICY_NAME_FOR_PERSONALIZE}",
"Statement": [
    {{
        "Sid": "{S3_BUCKET_POLICY_NAME_FOR_PERSONALIZE}",
        "Effect": "Allow",
        "Principal": {{
            "Service": "personalize.amazonaws.com"
        }},
        "Action": "s3:*",
        "Resource": [
            "arn:aws:s3:::{BUCKET_NAME}",
            "arn:aws:s3:::{BUCKET_NAME}/*"
        ]
    }}
]
}}'''

    bucket_policy = boto3.resource('s3').BucketPolicy(BUCKET_NAME)
    bucket_policy.put(
        ConfirmRemoveSelfBucketAccess=True,
        Policy=policy)

def upload_data():
    csv_file_paths = util.get_file_paths_recursively(DATA_DIRECTORY, "csv")
    logging.info("Csv files to upload: {}".format(csv_file_paths))

    s3 = boto3.resource('s3')
    for p in csv_file_paths:
        s3.meta.client.upload_file(p, BUCKET_NAME, p)

    sims_batch_input_path = "data/title/batch-input-sims.txt"
    s3.meta.client.upload_file(sims_batch_input_path, BUCKET_NAME, sims_batch_input_path)
    up_batch_input_path = "data/user/batch-input-up.txt"
    s3.meta.client.upload_file(up_batch_input_path, BUCKET_NAME, up_batch_input_path)

    s3.meta.client.upload_file(LAMBDA_PATH, BUCKET_NAME, LAMBDA_PATH)


def create_s3_role():
    logging.info("Creating a role for Personalize. Role name: " + S3_ROLE_NAME_FOR_PERSONALIZE)

    role_arn = iam_client.create_role(
        RoleName=S3_ROLE_NAME_FOR_PERSONALIZE,
        AssumeRolePolicyDocument='''{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "personalize.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}''')['Role']['Arn']

    new_policy = iam_client.create_policy(
        PolicyName=S3_POLICY_NAME_FOR_ROLE_FOR_PERSONALIZE,
        PolicyDocument=f'''{{
    "Version": "2012-10-17",
    "Id": "{S3_POLICY_NAME_FOR_ROLE_FOR_PERSONALIZE}",
    "Statement": [
        {{
            "Sid": "{S3_POLICY_NAME_FOR_ROLE_FOR_PERSONALIZE}",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::{BUCKET_NAME}",
                "arn:aws:s3:::{BUCKET_NAME}/*"
            ]
        }}
    ]
}}''')
    new_policy_arn = new_policy['Policy']['Arn']

    policy = iam_resource.Policy(new_policy_arn)
    policy.attach_role(RoleName=S3_ROLE_NAME_FOR_PERSONALIZE)

    PersistentValues[S3_ROLE_NAME_FOR_PERSONALIZE] = role_arn
    PersistentValues[S3_POLICY_NAME_FOR_ROLE_FOR_PERSONALIZE] = new_policy_arn
    write(PersistentValues)

def create_s3_role_for_pinpoint():
    logging.info("Creating a role for Personalize. Role name: " + S3_ROLE_NAME_FOR_PINPOINT)

    role_arn = iam_client.create_role(
        RoleName=S3_ROLE_NAME_FOR_PINPOINT,
        AssumeRolePolicyDocument='''{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "pinpoint.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}''')['Role']['Arn']

    new_policy = iam_client.create_policy(
        PolicyName=S3_POLICY_NAME_FOR_ROLE_FOR_PINPOINT,
        PolicyDocument=f'''{{
    "Version": "2012-10-17",
    "Id": "{S3_POLICY_NAME_FOR_ROLE_FOR_PINPOINT}",
    "Statement": [
        {{
            "Sid": "{S3_POLICY_NAME_FOR_ROLE_FOR_PINPOINT}",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::{BUCKET_NAME}",
                "arn:aws:s3:::{BUCKET_NAME}/*"
            ]
        }}
    ]
}}''')
    new_policy_arn = new_policy['Policy']['Arn']

    policy = iam_resource.Policy(new_policy_arn)
    policy.attach_role(RoleName=S3_ROLE_NAME_FOR_PINPOINT)

    PersistentValues[S3_ROLE_NAME_FOR_PINPOINT] = role_arn
    PersistentValues[S3_POLICY_NAME_FOR_ROLE_FOR_PINPOINT] = new_policy_arn
    write(PersistentValues)

def register_schema():
    json_file_paths = util.get_file_paths_recursively(DATA_DIRECTORY, "json")

    for p in json_file_paths:
        with open(p) as f:
            schema_name = p.split("/")[1]
            createSchemaResponse = personalize.create_schema(
                name=schema_name,
                schema=f.read())

        schema_arn = createSchemaResponse['schemaArn']
        logging.info('Schema Name: {}, ARN: {}'.format(schema_name, schema_arn))
        PersistentValues[schema_name] = schema_arn

    write(PersistentValues)


def create_dataset_group():
    response = personalize.create_dataset_group(name = DSG_NAME)
    dsg_arn = response['datasetGroupArn']

    PersistentValues[DSG] = dsg_arn
    write(PersistentValues)

    logging.info("Dataset group has been created. ARN: " + dsg_arn)

    util.wait_until_status(
        lambda _="" : personalize.describe_dataset_group(datasetGroupArn=dsg_arn)["datasetGroup"]["status"],
        "Creating dataset group...",
        "ACTIVE")


def create_dataset(datasetGroupArn, titleSchemaArn, userSchemaArn, titleReadSchemaArn):
    dataset_arn = 'datasetArn'

    title_dataset = personalize.create_dataset(
      name = TITLE,
      schemaArn = titleSchemaArn,
      datasetGroupArn = datasetGroupArn,
      datasetType = "Items"
    )
    logging.info("titleDatasetArn: " + title_dataset[dataset_arn])
    PersistentValues[TITLE_DATASET] = title_dataset[dataset_arn]
    write(PersistentValues)

    user_dataset = personalize.create_dataset(
      name = USER,
      schemaArn = userSchemaArn,
      datasetGroupArn = datasetGroupArn,
      datasetType = "Users"
    )
    logging.info("userDatasetArn: " + user_dataset[dataset_arn])
    PersistentValues[USER_DATASET] = user_dataset[dataset_arn]
    write(PersistentValues)

    title_read_dataset = personalize.create_dataset(
      name = TITLE_READ,
      schemaArn = titleReadSchemaArn,
      datasetGroupArn = datasetGroupArn,
      datasetType = "Interactions"
    )
    logging.info("titleReadDatasetArn: " + title_read_dataset[dataset_arn])
    PersistentValues[TITLE_READ_DATASET] = title_read_dataset[dataset_arn]
    write(PersistentValues)


def import_dataset(titleDatasetArn, userDatasetArn, titleReadDatasetArn):
    role_arn = iam_resource.Role(S3_ROLE_NAME_FOR_PERSONALIZE).arn
    DATASET_IMPORT_JOB_ARN = 'datasetImportJobArn'

    title_import_job = personalize.create_dataset_import_job(
        jobName='TitleImportJob',
        datasetArn=titleDatasetArn,
        dataSource={'dataLocation': f's3://{BUCKET_NAME}/data/title/title.csv'},
        roleArn=role_arn)

    user_import_job = personalize.create_dataset_import_job(
        jobName='UserImportJob',
        datasetArn=userDatasetArn,
        dataSource={'dataLocation': f's3://{BUCKET_NAME}/data/user/user.csv'},
        roleArn=role_arn)

    title_read_import_job = personalize.create_dataset_import_job(
        jobName='TitleReadImportJob',
        datasetArn=titleReadDatasetArn,
        dataSource={'dataLocation': f's3://{BUCKET_NAME}/data/title-read/title-read.csv'},
        roleArn=role_arn)

    util.wait_until_status(
        lambdaToGetStatus=lambda _="": personalize.describe_dataset_import_job(
            datasetImportJobArn=title_import_job[DATASET_IMPORT_JOB_ARN])["datasetImportJob"]["status"],
        messagePrefix="Importing title dataset...",
        expectedStatus="ACTIVE")

    util.wait_until_status(
        lambdaToGetStatus=lambda _="": personalize.describe_dataset_import_job(
            datasetImportJobArn=user_import_job[DATASET_IMPORT_JOB_ARN])["datasetImportJob"]["status"],
        messagePrefix="Importing user dataset...",
        expectedStatus="ACTIVE")

    util.wait_until_status(
        lambdaToGetStatus=lambda _="": personalize.describe_dataset_import_job(
            datasetImportJobArn=title_read_import_job[DATASET_IMPORT_JOB_ARN])["datasetImportJob"]["status"],
        messagePrefix="Importing title-read dataset...",
        expectedStatus="ACTIVE")


def create_filter(dsg_arn):
    filer_response = personalize.create_filter(
        name='FILTER_USER_PERSONALIZATION',
        datasetGroupArn=dsg_arn,
        filterExpression='EXCLUDE itemId WHERE INTERACTIONS.event_type in ("title-read")')

    filter_arn = filer_response['filterArn']
    PersistentValues[FILTER_UP] = filter_arn
    write(PersistentValues)


async def create_sims_solution(dsg_arn):
    solution_response = personalize.create_solution(
        name=SOLUTION_NAME_SIMS,
        datasetGroupArn=dsg_arn,
        recipeArn='arn:aws:personalize:::recipe/aws-sims')

    solution_arn = solution_response['solutionArn']
    PersistentValues[SOLUTION_SIMS] = solution_arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_solution(solutionArn=solution_arn)['solution']["status"],
        messagePrefix="Creating a sims solution...",
        expectedStatus="ACTIVE")

    solution_version_response = personalize.create_solution_version(
        solutionArn=solution_arn)
    solution_version_arn = solution_version_response['solutionVersionArn']

    PersistentValues[SOLUTION_VERSION_SIMS] = solution_version_arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_solution_version(
            solutionVersionArn=solution_version_arn)['solutionVersion']['status'],
        messagePrefix="Creating a sims solution version...",
        expectedStatus="ACTIVE")


async def create_sims_campaign(solutionVersionArn):
    response = personalize.create_campaign(
        name=CAMPAIGN_NAME_SIMS,
        solutionVersionArn=solutionVersionArn,
        minProvisionedTPS=1)

    arn = response['campaignArn']
    PersistentValues[CAMPAIGN_SIMS] = arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_campaign(campaignArn=arn)['campaign']['status'],
        messagePrefix="Creating a sims campaign...",
        expectedStatus="ACTIVE")


async def create_sims_batch_inference_job(solutionVersionArn, roleArn):
    batchInferenceJobArn = personalize.create_batch_inference_job(
        jobName="manhwakyung-title-recommendation-batch-" + util.get_random_string(8),
        solutionVersionArn=solutionVersionArn,
        roleArn=roleArn,
        jobInput={
            's3DataSource': {
                'path': f's3://{BUCKET_NAME}/data/title/batch-input-sims.txt'
            }
        },
        jobOutput={
            's3DataDestination': {
                'path': f's3://{BUCKET_NAME}/results/by-title-id/'
            }
        }
    )['batchInferenceJobArn']

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="":
        personalize.describe_batch_inference_job(batchInferenceJobArn=batchInferenceJobArn)['batchInferenceJob'][
            'status'],
        messagePrefix="Running sims batch inference job...",
        expectedStatus="ACTIVE")


async def create_up_solution(dsg_arn):
    solution_response = personalize.create_solution(
        name=SOLUTION_NAME_UP,
        datasetGroupArn=dsg_arn,
        recipeArn='arn:aws:personalize:::recipe/aws-user-personalization')

    solution_arn = solution_response['solutionArn']
    PersistentValues[SOLUTION_UP] = solution_arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_solution(solutionArn=solution_arn)['solution']["status"],
        messagePrefix="Creating a up solution...",
        expectedStatus="ACTIVE")

    solution_version_response = personalize.create_solution_version(
        solutionArn=solution_arn)
    solution_version_arn = solution_version_response['solutionVersionArn']

    PersistentValues[SOLUTION_VERSION_UP] = solution_version_arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_solution_version(
            solutionVersionArn=solution_version_arn)['solutionVersion']['status'],
        messagePrefix="Creating a up solution version...",
        expectedStatus="ACTIVE")


async def create_up_campaign(solutionVersionArn):
    response = personalize.create_campaign(
        name=CAMPAIGN_NAME_UP,
        solutionVersionArn=solutionVersionArn,
        minProvisionedTPS=1)

    arn = response['campaignArn']
    PersistentValues[CAMPAIGN_UP] = arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_campaign(campaignArn=arn)['campaign']['status'],
        messagePrefix="Creating a up campaign...",
        expectedStatus="ACTIVE")


async def create_recommendation_data_sims():
    ### sims recipe(작품별 추천) 아래 세 작업 총 합해서 1시간 ~ 1시간 30분 소요

    # Persoanlize Solution및 Solution Version 생성
    await create_sims_solution(PersistentValues[DSG])

    # Persoanlize Campaign 생성
    await create_sims_campaign(PersistentValues[SOLUTION_VERSION_SIMS])

    # Batch Inference Job을 생성해서 훈련이 완료된 모델에서 모든 작품에 대한 추천 작품 데이터를 뽑아 S3에 저장
    # S3 버킷의 data/title/batch-input-sims.txt 파일에 모든 작품에 대한 id가 있고, 이 파일이 batch의 input으로 들어간다.
    # batch의 output은 S3 버킷의 results/by-title-id/ 이하에 저장됨.
    await create_sims_batch_inference_job(solutionVersionArn=PersistentValues[SOLUTION_VERSION_SIMS],
                                          roleArn=PersistentValues[S3_ROLE_NAME_FOR_PERSONALIZE])


async def create_recommendation_data_up():
    ### user-personalization recipe(사용자별 추천) 아래 세 작업 총 합해서 1시간 ~ 1시간 30분 소요

    # Persoanlize Solution및 Solution Version 생성
    await create_up_solution(PersistentValues[DSG])

    # Persoanlize Campaign 생성
    await create_up_campaign(PersistentValues[SOLUTION_VERSION_UP])

# 여러가지 추천 데이터 생성 작업을 병렬로 진행.
async def create_recommendation_data(): 
    await asyncio.gather(
          asyncio.create_task(create_recommendation_data_sims()),
          asyncio.create_task(create_recommendation_data_up()))


def create_lambda_role():
    logging.info("Creating a role for Lambda. Role name: " + LAMBDA_ROLE_NAME)

    role_arn = iam_client.create_role(
        RoleName=LAMBDA_ROLE_NAME,
        AssumeRolePolicyDocument='''{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}''')['Role']['Arn']

    new_policy = iam_client.create_policy(
        PolicyName=LAMBDA_POLICY_NAME,
        PolicyDocument=f'''{{
    "Version": "2012-10-17",
    "Id": "{LAMBDA_POLICY_NAME}",
    "Statement": [
        {{
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:{REGION}:{ACCOUNT_ID}:*"
        }},
        {{
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:{REGION}:{ACCOUNT_ID}:log-group:/aws/lambda/{FUNCTION_NAME}:*"
            ]
        }}
    ]
}}''')
    new_policy_arn = new_policy['Policy']['Arn']

    policy = iam_resource.Policy(new_policy_arn)
    policy.attach_role(RoleName=LAMBDA_ROLE_NAME)

    PersistentValues[LAMBDA_ROLE_NAME] = role_arn
    PersistentValues[LAMBDA_POLICY_NAME] = new_policy_arn
    write(PersistentValues)


def create_ml_role():
    logging.info("Creating a role for Lambda. Role name: " + ML_ROLE_NAME)

    role_arn = iam_client.create_role(
        RoleName=ML_ROLE_NAME,
        AssumeRolePolicyDocument='''{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "pinpoint.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}''')['Role']['Arn']

    new_policy = iam_client.create_policy(
        PolicyName=ML_POLICY_NAME,
        PolicyDocument=f'''{{
    "Version": "2012-10-17",
    "Id": "{ML_POLICY_NAME}",
    "Statement": [
        {{
            "Effect": "Allow",
            "Action": [
                "personalize:*"
            ],
            "Resource": [
                "{PersistentValues[CAMPAIGN_UP]}",
                "{PersistentValues[SOLUTION_UP]}"
            ]
        }}
    ]
}}''')
    new_policy_arn = new_policy['Policy']['Arn']

    policy = iam_resource.Policy(new_policy_arn)
    policy.attach_role(RoleName=ML_ROLE_NAME)

    PersistentValues[ML_ROLE_NAME] = role_arn
    PersistentValues[ML_POLICY_NAME] = new_policy_arn
    write(PersistentValues)


def create_function():
    logging.info('Create Lambda. Function name : {}'.format(FUNCTION_NAME))
    function_response = function.create_function(FunctionName=FUNCTION_NAME,
                                                 Runtime='python3.8',
                                                 Role=PersistentValues[LAMBDA_ROLE_NAME],
                                                 Handler='lambda_function.lambda_handler',
                                                 Code={
                                                     'S3Bucket': BUCKET_NAME,
                                                     'S3Key': LAMBDA_PATH})
    function_arn = function_response['FunctionArn']
    PersistentValues[FUNCTION_NAME] = function_arn
    write(PersistentValues)


def add_permission():
    logging.info('Add lambda policy for AWS Pinpoint. Function name : {}'.format(FUNCTION_NAME))
    function.add_permission(FunctionName=FUNCTION_NAME,
                            StatementId='sid',
                            Action='lambda:InvokeFunction',
                            Principal=f'pinpoint.{REGION}.amazonaws.com',
                            SourceArn=f'arn:aws:mobiletargeting:{REGION}:{ACCOUNT_ID}:recommenders/*')


def create_app():
    logging.info('Create Pinpoint. Application name : {}, region: {}'.format(APPLICATION_NAME, REGION))
    app_response = pinpoint.create_app(CreateApplicationRequest={
        'Name': APPLICATION_NAME})
    app_id = app_response['ApplicationResponse']['Id']
    PersistentValues[APPLICATION_NAME] = app_id
    write(PersistentValues)


def update_email_channel():
    logging.info('Enable Email Channel. Application name : {}'.format(APPLICATION_NAME))
    pinpoint.update_email_channel(ApplicationId=PersistentValues[APPLICATION_NAME],
                                  EmailChannelRequest={
                                      'Enabled': True,
                                      'Identity': f'arn:aws:ses:{REGION}:{ACCOUNT_ID}:identity/{ADDRESS}',
                                      'FromAddress': ADDRESS})


def create_recommender_configuration():
    logging.info('Create ML Model. Recommender name : {}'.format(ML_NAME))
    model_response = pinpoint.create_recommender_configuration(CreateRecommenderConfiguration={
                                                                   'Attributes': {
                                                                       'Recommendations.Title': 'Title'},
                                                                   'Name': ML_NAME,
                                                                   'RecommendationProviderIdType': 'PINPOINT_USER_ID',
                                                                   'RecommendationProviderRoleArn': PersistentValues[ML_ROLE_NAME],
                                                                   'RecommendationProviderUri': PersistentValues[CAMPAIGN_UP],
                                                                   'RecommendationTransformerUri': FUNCTION_NAME,
                                                                   'RecommendationsPerMessage': 5})
    model_id = model_response['RecommenderConfigurationResponse']['Id']
    PersistentValues[ML_NAME] = model_id
    write(PersistentValues)


def create_email_template():
    logging.info('Create Email Template. Template name : {}'.format(EMAIL_NAME))
    pinpoint.create_email_template(TemplateName=EMAIL_NAME,
                                   EmailTemplateRequest={
                                       'HtmlPart': HTML_TEXT,
                                       'RecommenderId': PersistentValues[ML_NAME],
                                       'Subject': EMAIL_NAME})


def create_import_job():
    logging.info('Create Segment. Segment name : {}'.format(SEGEMENT_NAME))
    segment_response = pinpoint.create_import_job(ApplicationId=PersistentValues[APPLICATION_NAME],
                                                  ImportJobRequest={
                                                      'DefineSegment': True,
                                                      'Format': 'CSV',
                                                      'RoleArn': PersistentValues[S3_ROLE_NAME_FOR_PINPOINT],
                                                      'S3Url': f's3://{BUCKET_NAME}/{SEGMENT_PATH}',
                                                      'SegmentName': SEGEMENT_NAME})
    time.sleep(10) # 10초를 기다리지 않으면 SegmentId가 생성되지 않음...
    segment_id = segment_response['ImportJobResponse']['Definition']['SegmentId']
    PersistentValues[SEGEMENT_NAME] = segment_id
    write(PersistentValues)


def create_campaign():
    logging.info('Create Campaign. Campaign name : {}'.format(CAMPAIGN_NAME))
    campaign_response = pinpoint.create_campaign(ApplicationId=PersistentValues[APPLICATION_NAME],
                                                 WriteCampaignRequest={
                                                     'Name': CAMPAIGN_NAME,
                                                     'SegmentId': PersistentValues[SEGEMENT_NAME],
                                                     'TemplateConfiguration': {
                                                         'EmailTemplate': {
                                                             'Name': EMAIL_NAME}},
                                                     'Schedule': {
                                                         'StartTime': 'IMMEDIATE'}})
    campaign_id = campaign_response['CampaignResponse']['Arn']
    PersistentValues[CAMPAIGN_NAME] = campaign_id
    write(PersistentValues)


if __name__ == "__main__":

    create_bucket() # 버킷 생성... 을 하지 않음. api cdk를 셋업하면서 만들어진 버킷을 사용
    add_bucket_policy() # 버킷 정책 설정
    upload_data() # data 디렉토리의 파일을 S3에 업로드

    create_s3_role() # Personalize, Pinpoint를 위한 IAM Role 및 Policy 생성
    register_schema() # Personalize에 스키마 등록
    create_dataset_group() # 훈련에 사용할 데이터셋 그룹 생성

    # 데이터셋 그룹에 데이터셋 생성
    create_dataset(
      datasetGroupArn=PersistentValues[DSG],
      titleSchemaArn=PersistentValues[TITLE],
      userSchemaArn=PersistentValues[USER],
      titleReadSchemaArn=PersistentValues[TITLE_READ])

    logging.info("Wait 30 seconds for a role to acquire authorities...")
    time.sleep(30)

    # 데이터셋에 해당하는 데이터를 S3에서 불러오기. 30~40분 소요
    import_dataset(
      titleDatasetArn=PersistentValues[TITLE_DATASET],
      userDatasetArn=PersistentValues[USER_DATASET],
      titleReadDatasetArn=PersistentValues[TITLE_READ_DATASET])

    # 이미 본 작품을 배재하고 추천하기 위한 필터 생성(User-Personalization에서 사용)
    create_filter(PersistentValues[DSG])

    # sims recipe, user-personalization recipe 병렬로 진행(약 1시간 30분 ~ 2시간)
    asyncio.run(create_recommendation_data())

    # 유저 기반 추천 예시
    userId = 'cce93dce-b13a-4cd3-9380-008d48e6a53c'
    response = personalize_runtime.get_recommendations(
        campaignArn=PersistentValues[CAMPAIGN_UP],
        userId='User ID',
        filterArn=PersistentValues[FILTER_UP])
    print("Recommended items by user " + userId)
    for item in response['itemList']:
        print(item['itemId'])

    # ########################################
    # # Pinpoint 관련
    # ########################################

    get_accountid() # 사용자 account id를 가져옴

    create_s3_role_for_pinpoint()

    create_lambda_role() # lambda를 위한 IAM Role 및 Policy 생성
    create_ml_role() # ML(pinpoint)를 위한 IAM Role 및 Policy 생성

    time.sleep(10) # role이 생성 완료될 때까지 10초 기다리기

    create_function() # title id를 title로 변경해줄 lambda 생성
    add_permission() # lambda에 권한 넣어줌

    create_app() # pinpoint application 생성
    update_email_channel() # 이메일 채널 활성화

    create_recommender_configuration() # personalize와 연결된 추천 모델 생성
    create_email_template() # 이메일 템플릿 생성

    create_import_job() # segment 생성
    create_campaign() # cmapaign 생성
