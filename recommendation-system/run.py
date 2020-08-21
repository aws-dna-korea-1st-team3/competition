import logging
import boto3
import os.path
import time

from botocore.exceptions import ClientError

# global variables
region='ap-northeast-2'

personalize = boto3.client('personalize', region_name=region)
s3 = boto3.client('s3', region_name=region)
iam_client = boto3.client('iam', region_name=region)
iam_resource = boto3.resource('iam', region_name=region)

logging.basicConfig(level=logging.INFO)

BUCKET_NAME = "team3-recommendation-system-personalize-data-1"
DATA_DIRECTORY = "data"

TITLE = "title"
USER = "user"
TITLE_READ = "title-read"
ROLE_NAME = "team3-recommendation-system"

# utils
def get_file_paths_recursively(dirname, ext):
  files = []
  for r, _, f in os.walk(dirname):
      for file in f:
          if '.' + ext in file:
              files.append(os.path.join(r, file))
  return files

def create_getting_next_dots(): 
  number_of_dots = 1
  def get_next_dots():
      nonlocal number_of_dots
      dots = ""
      for _ in range(0, number_of_dots):
          dots += "."
      number_of_dots %= 3
      number_of_dots += 1

      return dots
  return get_next_dots

get_next_dots = create_getting_next_dots()

def wait_until_status(lambdaToGetStatus, messagePrefix, expectedStatus):
    while True:
        status = lambdaToGetStatus()
        if status != expectedStatus:
            logging.info(messagePrefix + " current status: " + status + get_next_dots())
            time.sleep(1.5)
        else:
            logging.info("expected status achieved: " + status)
            break

# AWS
def create_bucket():
    logging.info('Create bucket. bucket_name: {}, region: {}'.format(BUCKET_NAME, region))

    location = {'LocationConstraint': region}
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
        "Action": [
            "s3:GetObject",
            "s3:ListBucket"
        ],
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
    csv_file_paths = get_file_paths_recursively(DATA_DIRECTORY, "csv")
    logging.info("Csv files to upload: {}".format(csv_file_paths))

    s3 = boto3.resource('s3')
    for p in csv_file_paths:
        s3.meta.client.upload_file(p, BUCKET_NAME, p)


def register_schema():
    json_file_paths = get_file_paths_recursively(DATA_DIRECTORY, "json")

    arn_dictionary = {}

    for p in json_file_paths:
        with open(p) as f:
            schema_name = p.split("/")[1]
            createSchemaResponse = personalize.create_schema(
                name = schema_name,
                schema = f.read())

        schema_arn = createSchemaResponse['schemaArn']
        logging.info('Schema Name: {}, ARN: {}'.format(schema_name, schema_arn))
        arn_dictionary[schema_name] = schema_arn
    
    return arn_dictionary

def create_dataset_group():
    response = personalize.create_dataset_group(name = 'manhwakyung-title-recommendation')
    dsg_arn = response['datasetGroupArn']

    logging.info("Dataset group has been created. ARN: " + dsg_arn)

    wait_until_status(
        lambda _="" : personalize.describe_dataset_group(datasetGroupArn=dsg_arn)["datasetGroup"]["status"],
        "Creating dataset group...",
        "ACTIVE")

    return dsg_arn

def create_dataset(dataset_group_arn, schema_arn_dict):
    dataset_arn = 'datasetArn'

    title_dataset = personalize.create_dataset(
      name = TITLE,
      schemaArn = schema_arn_dict[TITLE],
      datasetGroupArn = dataset_group_arn,
      datasetType = "Items"
    )
    logging.info("titleDatasetArn: " + title_dataset[dataset_arn])

    user_dataset = personalize.create_dataset(
      name = USER,
      schemaArn = schema_arn_dict[USER],
      datasetGroupArn = dataset_group_arn,
      datasetType = "Users"
    )
    logging.info("userDatasetArn: " + user_dataset[dataset_arn])

    title_read_dataset = personalize.create_dataset(
      name = TITLE_READ,
      schemaArn = schema_arn_dict[TITLE_READ],
      datasetGroupArn = dataset_group_arn,
      datasetType = "Interactions"
    )
    logging.info("titleReadDatasetArn: " + title_read_dataset[dataset_arn])

    dataset_arn_dict = {}
    dataset_arn_dict[TITLE] = title_dataset[dataset_arn]
    dataset_arn_dict[USER] = user_dataset[dataset_arn]
    dataset_arn_dict[TITLE_READ] = title_read_dataset[dataset_arn]

    return dataset_arn_dict

def create_role():
    logging.info("Creating a role for Personalize. Role name: " + ROLE_NAME)

    iam_client.create_role(
        RoleName = ROLE_NAME,
        AssumeRolePolicyDocument = '''{
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
}''')

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
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
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

    return new_policy_arn

def import_dataset(dataset_arn_dict):
    role_arn = iam_resource.Role(ROLE_NAME).arn
    DATASET_IMPORT_JOB_ARN = 'datasetImportJobArn'

    title_import_job = personalize.create_dataset_import_job(
        jobName = 'TitleImportJob',
        datasetArn = dataset_arn_dict[TITLE],
        dataSource = {'dataLocation':f's3://{BUCKET_NAME}/data/title/title.csv'},
        roleArn = role_arn)

    user_import_job = personalize.create_dataset_import_job(
        jobName = 'UserImportJob',
        datasetArn = dataset_arn_dict[USER],
        dataSource = {'dataLocation':f's3://{BUCKET_NAME}/data/user/user.csv'},
        roleArn = role_arn) 

    title_read_import_job = personalize.create_dataset_import_job(
        jobName = 'TitleReadImportJob',
        datasetArn = dataset_arn_dict[TITLE_READ],
        dataSource = {'dataLocation':f's3://{BUCKET_NAME}/data/title-read/title-read.csv'},
        roleArn = role_arn) 

    wait_until_status(
        lambdaToGetStatus = lambda _="" : personalize.describe_dataset_import_job(
            datasetImportJobArn=title_import_job[DATASET_IMPORT_JOB_ARN])["datasetImportJob"]["status"],
        messagePrefix = "Importing title dataset group...",
        expectedStatus = "ACTIVE")

    wait_until_status(
        lambdaToGetStatus = lambda _="" : personalize.describe_dataset_import_job(
            datasetImportJobArn=user_import_job[DATASET_IMPORT_JOB_ARN])["datasetImportJob"]["status"],
        messagePrefix = "Importing user dataset group...",
        expectedStatus = "ACTIVE")

    wait_until_status(
        lambdaToGetStatus = lambda _="" : personalize.describe_dataset_import_job(
            datasetImportJobArn=title_read_import_job[DATASET_IMPORT_JOB_ARN])["datasetImportJob"]["status"],
        messagePrefix = "Importing title-read dataset group...",
        expectedStatus = "ACTIVE")


def delete_role(policyArn):
    logging.info("Delete role. Role name: " + ROLE_NAME)
    iam_client.detach_role_policy(
      RoleName=ROLE_NAME,
      PolicyArn=policyArn
    )

    iam_client.delete_role(RoleName=ROLE_NAME)
    iam_client.delete_policy(PolicyArn=policyArn)

def delete_schema(arn):
    personalize.delete_schema(schemaArn=arn)

def delete_schemas(arns):
    logging.info("Delete schema: " + ", ".join(arns))
    for arn in arns:
        delete_schema(arn)

def delete_dataset_group(dsg_arn):
    personalize.delete_dataset_group(datasetGroupArn=dsg_arn)

    try:
        wait_until_status(
                lambda _="" : personalize.describe_dataset_group(datasetGroupArn=dsg_arn)["datasetGroup"]["status"],
                "Deleting dataset group...",
                "Exception")

    except:
        logging.info("Dataset group has been deleted.")

def delete_dataset(arns):
    logging.info("Delete dataset: " + ", ".join(arns))
    for arn in arns:
        personalize.delete_dataset(datasetArn=arn)

    logging.info("Wait until datasets are deleted...")
    time.sleep(10)


def delete_bucket():
    logging.info('Destory all resources: {}'.format(BUCKET_NAME))
    # TODO: delete all s3 files of the bucket.
    # TODO: delete s3 bucket.
    # TODO: delete dataset group
    # TODO: delete schema

    s3_client = boto3.client('s3')
    s3_client.delete_bucket(Bucket=BUCKET_NAME)


##### main
create_bucket()
add_bucket_policy()
upload_data()

policy_arn = create_role()

schema_arn_dict = register_schema()
# schema_arn_dict = {'title': 'arn:aws:personalize:ap-northeast-2:772278550552:schema/title', 'title-read': 'arn:aws:personalize:ap-northeast-2:772278550552:schema/title-read', 'user': 'arn:aws:personalize:ap-northeast-2:772278550552:schema/user'}

dsg_arn = create_dataset_group()
# dsg_arn = 'arn:aws:personalize:ap-northeast-2:772278550552:dataset-group/manhwakyung-title-recommendation'

dataset_arn_dict = create_dataset(dsg_arn, schema_arn_dict)
# dataset_arn_dict = {}
# dataset_arn_dict[TITLE] = 'arn:aws:personalize:ap-northeast-2:772278550552:dataset/manhwakyung-title-recommendation/ITEMS'
# dataset_arn_dict[USER] = 'arn:aws:personalize:ap-northeast-2:772278550552:dataset/manhwakyung-title-recommendation/USERS'
# dataset_arn_dict[TITLE_READ] = 'arn:aws:personalize:ap-northeast-2:772278550552:dataset/manhwakyung-title-recommendation/INTERACTIONS'

import_dataset(dataset_arn_dict)

exit(0)

# TODO: add separated script to delete resources.

delete_dataset(dataset_arn_dict.values())
delete_dataset_group(dsg_arn) 
delete_schemas(schema_arn_dict.values())

#policy_arn='arn:aws:iam::772278550552:policy/Team3RecommendationSystemPersonalizeS3BucketAccessPolicy'
delete_role(policy_arn)

# TODO: delete all data in s3?
delete_bucket()
