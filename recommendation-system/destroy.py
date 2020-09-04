#!/usr/bin/env python3
import logging
import boto3
import os.path
import time
import constant
import util

from botocore.exceptions import ClientError
from constant import REGION, BUCKET_NAME, DATA_DIRECTORY, TITLE, USER, TITLE_READ, ROLE_NAME, SOLUTION_NAME_SIMS, SOLUTION_NAME_HRNN, CAMPAIGN_NAME_SIMS, CAMPAIGN_NAME_HRNN, ROLE, POLICY, DSG, DSG_NAME, TITLE_DATASET, TITLE_READ_DATASET, USER_DATASET, SOLUTION_SIMS, SOLUTION_HRNN, CAMPAIGN_SIMS, CAMPAIGN_HRNN
from persistent_value import PersistentValues, write 

# aws clients
personalize = boto3.client('personalize', region_name=REGION)
personalize_runtime = boto3.client('personalize-runtime', region_name=REGION)

s3 = boto3.client('s3', region_name=REGION)
iam_client = boto3.client('iam', region_name=REGION)
iam_resource = boto3.resource('iam', region_name=REGION)

def delete_campaign(campaignArn, campaignName):
    try:
      personalize.delete_campaign(campaignArn=campaignArn)
      util.wait_until_status(
          lambdaToGetStatus=lambda _="": personalize.describe_campaign(campaignArn=campaignArn)['campaign']['status'],
          messagePrefix=f"Deleting {campaignName} campaign...",
          expectedStatus="DELETED")

    except:
        logging.info(f"The {campaignName} campaign has been deleted.")

def delete_dataset(arns):
    logging.info("Delete dataset: " + ", ".join(arns))
    for arn in arns:
        personalize.delete_dataset(datasetArn=arn)

    logging.info("Wait until datasets are deleted... It takes 2 minutes.")
    time.sleep(120)

def delete_dataset_group(dsg_arn):
    personalize.delete_dataset_group(datasetGroupArn=dsg_arn)

    try:
        util.wait_until_status(
            lambda _="": personalize.describe_dataset_group(datasetGroupArn=dsg_arn)[
                "datasetGroup"]["status"],
            "Deleting dataset group...",
            "Exception")

    except:
        logging.info("Dataset group has been deleted.")

def delete_schemas(arns):
    logging.info("Delete schema: " + ", ".join(arns))
    for arn in arns:
        personalize.delete_schema(schemaArn=arn)
  
def delete_role_and_policy(policyArn):
    logging.info("Delete role. Role name: " + ROLE_NAME)
    iam_client.detach_role_policy(
        RoleName=ROLE_NAME,
        PolicyArn=policyArn
    )

    iam_client.delete_role(RoleName=ROLE_NAME)
    iam_client.delete_policy(PolicyArn=policyArn)

def delete_bucket():
    logging.info(f'Destory S3 Bucket: {BUCKET_NAME}')

    bucket = boto3.resource('s3', region_name=REGION).Bucket(BUCKET_NAME)

    response = s3.list_objects_v2(Bucket=BUCKET_NAME)

    bucket.delete_objects(Delete={
      'Objects': list(map(lambda c: {'Key': c['Key']}, response["Contents"]))
    })

    s3.delete_bucket(Bucket=BUCKET_NAME)

if __name__ == "__main__":
    delete_campaign(PersistentValues[CAMPAIGN_SIMS], "sims")
    delete_campaign(PersistentValues[CAMPAIGN_HRNN], "hrnn")

    personalize.delete_solution(solutionArn=PersistentValues[SOLUTION_SIMS])
    personalize.delete_solution(solutionArn=PersistentValues[SOLUTION_HRNN])

    delete_dataset([PersistentValues[TITLE_DATASET], PersistentValues[USER_DATASET], PersistentValues[TITLE_READ_DATASET]])
    delete_dataset_group(PersistentValues[DSG])
    delete_schemas([PersistentValues[TITLE], PersistentValues[USER], PersistentValues[TITLE_READ]])
    delete_role_and_policy(PersistentValues[POLICY])
    delete_bucket()
