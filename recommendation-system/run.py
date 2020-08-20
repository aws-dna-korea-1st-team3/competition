import logging
import boto3
import os.path
import time

from botocore.exceptions import ClientError

region='ap-northeast-2'

personalize = boto3.client('personalize', region_name=region)
s3 = boto3.client('s3', region_name=region)

logging.basicConfig(level=logging.INFO)

bucket_name = "team3-recommendation-system-data-5"
data_directory = "data"

# S3 Bucket creation
def create_bucket():
    logging.info('Create bucket. bucket_name: {}, region: {}'.format(bucket_name, region))

    location = {'LocationConstraint': region}
    s3.create_bucket(Bucket=bucket_name,
                            CreateBucketConfiguration=location)

def add_bucket_policy():
    logging.info('Add bucket policy for AWS Personalize. bucket_name: {}'.format(bucket_name))

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
            "arn:aws:s3:::{bucket_name}",
            "arn:aws:s3:::{bucket_name}/*"
        ]
    }}
]
}}'''
    bucket_policy = boto3.resource('s3').BucketPolicy(bucket_name)
    bucket_policy.put(
      ConfirmRemoveSelfBucketAccess=True,
      Policy=policy)

def get_file_paths_recursively(dirname, ext):
  files = []
  for r, _, f in os.walk(dirname):
      for file in f:
          if '.' + ext in file:
              files.append(os.path.join(r, file))
  return files

def upload_data():
    csv_file_paths = get_file_paths_recursively(data_directory, "csv")
    logging.info("Csv files to upload: {}".format(csv_file_paths))

    s3 = boto3.resource('s3')
    for p in csv_file_paths:
        s3.meta.client.upload_file(p, bucket_name, p)

def register_schema():
    json_file_paths = get_file_paths_recursively(data_directory, "json")

    arn_dictionary = {}

    for p in json_file_paths:
        with open(p) as f:
            schema_name = p.split("/")[1]
            createSchemaResponse = personalize.create_schema(
                name = schema_name,
                schema = f.read()
            )

        schema_arn = createSchemaResponse['schemaArn']
        logging.info('Schema Name: {}, ARN: {}'.format(schema_name, schema_arn))
        arn_dictionary[schema_name] = schema_arn
    
    return arn_dictionary

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

def wait_until_status(lambda_to_get_status, message_prefix, expected_status):
    while True:
        status = lambda_to_get_status()
        if status != expected_status:
            logging.info(message_prefix + " current status: " + status + get_next_dots())
            time.sleep(1)
        else:
            logging.info("expected status achieved: " + status)
            break

def create_dataset_group():
    response = personalize.create_dataset_group(name = 'manhwakyung-title-recommendation')
    dsg_arn = response['datasetGroupArn']

    logging.info("Dataset group has been created. ARN: " + dsg_arn)

    wait_until_status(
        lambda _="" : personalize.describe_dataset_group(datasetGroupArn=dsg_arn)["datasetGroup"]["status"],
        "Creating dataset group...",
        "ACTIVE")

    return dsg_arn

def delete_schema(arn):
    personalize.delete_schema(schemaArn=arn)

def delete_dataset_group(dsg_arn):
    personalize.delete_dataset_group(datasetGroupArn=dsg_arn)

    try:
        wait_until_status(
                lambda _="" : personalize.describe_dataset_group(datasetGroupArn=dsg_arn)["datasetGroup"]["status"],
                "Deleting dataset group...",
                "Exception")

    except:
        logging.info("Dataset group has been deleted.")

def destroy():
    logging.info('Destory all resources: {}'.format(bucket_name))
    # TODO: delete all s3 files of the bucket.
    # TODO: delete s3 bucket.
    # TODO: delete dataset group
    # TODO: delete schema

    s3_client = boto3.client('s3')
    s3_client.delete_bucket(Bucket=bucket_name)



##### main
# create_bucket()
# add_bucket_policy()
# upload_data()

# schema_arns = register_schema() # schema_arns = {'title': 'arn:aws:personalize:ap-northeast-2:772278550552:schema/title', 'title-read': 'arn:aws:personalize:ap-northeast-2:772278550552:schema/title-read', 'user': 'arn:aws:personalize:ap-northeast-2:772278550552:schema/user'}
# logging.info(schema_arns)

dsg_arn = create_dataset_group()
# dsg_arn = 'arn:aws:personalize:ap-northeast-2:772278550552:dataset-group/manhwakyung-title-recommendation'

delete_dataset_group(dsg_arn) 
# TODO: remove personalize data schema?
# TODO: delete all data in s3?
# destroy()
