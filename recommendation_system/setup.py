#!/usr/bin/env python3
import logging
import boto3
import os.path
import time
import constant
import util
import asyncio

from botocore.exceptions import ClientError
from constant import REGION, BUCKET_NAME, DATA_DIRECTORY, TITLE, USER, TITLE_READ, ROLE_NAME, SOLUTION_NAME_SIMS, \
    SOLUTION_NAME_HRNN, CAMPAIGN_NAME_SIMS, CAMPAIGN_NAME_HRNN, ROLE, POLICY, DSG, DSG_NAME, \
    TITLE_DATASET, TITLE_READ_DATASET, USER_DATASET, SOLUTION_SIMS, SOLUTION_HRNN, SOLUTION_VERSION_SIMS, SOLUTION_VERSION_HRNN, CAMPAIGN_SIMS, CAMPAIGN_HRNN
from persistent_value import PersistentValues, write

# aws clients
personalize = boto3.client('personalize', region_name=REGION)
personalize_runtime = boto3.client('personalize-runtime', region_name=REGION)

s3 = boto3.client('s3', region_name=REGION)
iam_client = boto3.client('iam', region_name=REGION)
iam_resource = boto3.resource('iam', region_name=REGION)


# procedures
def create_bucket():
    logging.info('Create bucket. bucket_name: {}, region: {}'.format(BUCKET_NAME, REGION))

    location = {'LocationConstraint': REGION}
    s3.create_bucket(Bucket=BUCKET_NAME,
                     CreateBucketConfiguration=location)


def add_bucket_policy():
    logging.info('Add bucket policy for AWS Personalize. bucket_name: {}'.format(BUCKET_NAME))

    policy = f'''{{
"Version": "2012-10-17",
"Id": "PersonalizeS3BucketAccessPolicy",
"Statement": [
    {{
        "Sid": "PersonalizeS3BucketAccessPolicy",
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
    hrnn_batch_input_path = "data/title/batch-input-hrnn.txt"
    s3.meta.client.upload_file(hrnn_batch_input_path, BUCKET_NAME, hrnn_batch_input_path)


def create_role():
    logging.info("Creating a role for Personalize. Role name: " + ROLE_NAME)

    role_arn = iam_client.create_role(
        RoleName=ROLE_NAME,
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
}''')[ROLE]["Arn"]

    policy_name = 'Team3RecommendationSystemPersonalizeS3BucketAccessPolicy'
    new_policy = iam_client.create_policy(
        PolicyName=policy_name,
        PolicyDocument=f'''{{
    "Version": "2012-10-17",
    "Id": "{policy_name}",
    "Statement": [
        {{
            "Sid": "{policy_name}",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::{BUCKET_NAME}",
                "arn:aws:s3:::{BUCKET_NAME}/*"
            ]
        }}
    ]
}}''')
    new_policy_arn = new_policy["Policy"]["Arn"]

    policy = iam_resource.Policy(new_policy_arn)
    policy.attach_role(RoleName=ROLE_NAME)

    PersistentValues[ROLE] = role_arn
    PersistentValues[POLICY] = new_policy_arn
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
    role_arn = iam_resource.Role(ROLE_NAME).arn
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


async def create_hrnn_solution(dsg_arn):
    solution_response = personalize.create_solution(
        name=SOLUTION_NAME_HRNN,
        datasetGroupArn=dsg_arn,
        recipeArn='arn:aws:personalize:::recipe/aws-hrnn')

    solution_arn = solution_response['solutionArn']
    PersistentValues[SOLUTION_HRNN] = solution_arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_solution(solutionArn=solution_arn)['solution']["status"],
        messagePrefix="Creating a hrnn solution...",
        expectedStatus="ACTIVE")

    solution_version_response = personalize.create_solution_version(
        solutionArn=solution_arn)
    solution_version_arn = solution_version_response['solutionVersionArn']

    PersistentValues[SOLUTION_VERSION_HRNN] = solution_version_arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_solution_version(
            solutionVersionArn=solution_version_arn)['solutionVersion']['status'],
        messagePrefix="Creating a hrnn solution version...",
        expectedStatus="ACTIVE")


async def create_hrnn_campaign(solutionVersionArn):
    response = personalize.create_campaign(
        name=CAMPAIGN_NAME_HRNN,
        solutionVersionArn=solutionVersionArn,
        minProvisionedTPS=1)

    arn = response['campaignArn']
    PersistentValues[CAMPAIGN_HRNN] = arn
    write(PersistentValues)

    await util.wait_until_status_async(
        lambdaToGetStatus=lambda _="": personalize.describe_campaign(campaignArn=arn)['campaign']['status'],
        messagePrefix="Creating a hrnn campaign...",
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
                                    roleArn=PersistentValues[ROLE])


async def create_recommendation_data_hrnn():
    ### hrnn recipe(사용자별 추천) 아래 세 작업 총 합해서 1시간 ~ 1시간 30분 소요

    # Persoanlize Solution및 Solution Version 생성
    await create_hrnn_solution(PersistentValues[DSG])

    # Persoanlize Campaign 생성
    await create_hrnn_campaign(PersistentValues[SOLUTION_VERSION_HRNN])

# 여러가지 추천 데이터 생성 작업을 병렬로 진행.
async def create_recommendation_data(): 
    await asyncio.gather(
          asyncio.create_task(create_recommendation_data_sims()),
          asyncio.create_task(create_recommendation_data_hrnn()))

if __name__ == "__main__":

    create_bucket() # 버킷 생성
    add_bucket_policy() # 버킷 정책 설정
    upload_data() # data 디렉토리의 파일을 S3에 업로드

    create_role() # Personalize를 위한 IAM Role 및 Policy 생성
    register_schema() # Personalize에 스키마 등록
    create_dataset_group() # 훈련에 사용할 데이터셋 그룹 생성

    # 데이터셋 그룹에 데이터셋 생성
    create_dataset(
      datasetGroupArn=PersistentValues[DSG],
      titleSchemaArn=PersistentValues[TITLE],
      userSchemaArn=PersistentValues[USER],
      titleReadSchemaArn=PersistentValues[TITLE_READ])

    # 데이터셋에 해당하는 데이터를 S3에서 불러오기. 30~40분 소요
    import_dataset(
      titleDatasetArn=PersistentValues[TITLE_DATASET],
      userDatasetArn=PersistentValues[USER_DATASET],
      titleReadDatasetArn=PersistentValues[TITLE_READ_DATASET])
    
    asyncio.run(create_recommendation_data())

    # 유저 기반 추천 예시
    userId = 'cce93dce-b13a-4cd3-9380-008d48e6a53c'
    response = personalize_runtime.get_recommendations(
        campaignArn=PersistentValues[CAMPAIGN_HRNN],
        userId='User ID')
    print("Recommended items by user " + userId)
    for item in response['itemList']:
        print (item['itemId'])
