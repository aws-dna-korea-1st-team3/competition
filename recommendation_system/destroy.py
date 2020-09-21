#!/usr/bin/env python3
import logging
import boto3
import os.path
import time
import constant
import util

from botocore.exceptions import ClientError
from constant import PERSISTENT_VALUE_FILE_PATH, REGION, \
                     BUCKET_NAME, DATA_DIRECTORY, SEGMENT_PATH, LAMBDA_PATH, \
                     S3_POLICY_NAME, S3_ROLE_NAME, LAMBDA_POLICY_NAME, LAMBDA_ROLE_NAME, ML_POLICY_NAME, ML_ROLE_NAME, \
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

def delete_campaign(campaignArn, campaignName):
    try:
      personalize.delete_campaign(campaignArn=campaignArn)
      util.wait_until_status(
          lambdaToGetStatus=lambda _="": personalize.describe_campaign(campaignArn=campaignArn)['campaign']['status'],
          messagePrefix=f"Deleting {campaignName} campaign...",
          expectedStatus="DELETED")

    except:
        logging.info(f"The {campaignName} campaign has been deleted.")

def delete_filter(filter_arn):
    logging.info("Delete filter: " + ", ".join(filter_arn))
    personalize.delete_filter(filterArn=filter_arn)

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
  
def delete_role_and_policy(roleName, policyArn, roleArn):
    logging.info("Delete role. Role name: " + roleName)
    iam_client.detach_role_policy(
        RoleName=roleArn,
        PolicyArn=policyArn
    )

    iam_client.delete_role(RoleName=roleArn)
    iam_client.delete_policy(PolicyArn=policyArn)

def delete_bucket():
    logging.info(f'Destory S3 Bucket: {BUCKET_NAME}')

    bucket = boto3.resource('s3', region_name=REGION).Bucket(BUCKET_NAME)

    response = s3.list_objects_v2(Bucket=BUCKET_NAME)

    bucket.delete_objects(Delete={
      'Objects': list(map(lambda c: {'Key': c['Key']}, response["Contents"]))
    })

    s3.delete_bucket(Bucket=BUCKET_NAME)


def delete_campaign():
    logging.info('Delete Campaign. Campaign name : {}'.format(CAMPAIGN_NAME))
    pinpoint.delete_campaign(ApplicationId=APPLICATION_NAME,
                             CampaignId=PersistentValues[CAMPAIGN_NAME])

def delete_segment():
    logging.info('Delete Segment. Segment name : {}'.format(SEGEMENT_NAME))
    pinpoint.delete_segment(ApplicationId=APPLICATION_NAME,
                            SegmentId=PersistentValues[SEGEMENT_NAME])

def delete_email_template():
    logging.info('Delete Email Template. Template name : {}'.format(EMAIL_NAME))
    pinpoint.delete_email_template(TemplateName=APPLICATION_NAME)

def delete_recommender_configuration():
    logging.info('Delete ML Model. Model name : {}'.format(ML_NAME))
    pinpoint.delete_recommender_configuration(RecommenderId=PersistentValues[ML_NAME])

def delete_app():
    logging.info('Delete Pinpoint App. App name : {}'.format(APPLICATION_NAME))
    pinpoint.delete_app(ApplicationId=APPLICATION_NAME)

def delete_function():
    logging.info('Delete Function. Function name : {}'.format(FUNCTION_NAME))
    function.delete_function(FunctionName=PersistentValues[FUNCTION_NAME])


if __name__ == "__main__":
    # personalize 관련 리소스 삭제
    delete_campaign(PersistentValues[CAMPAIGN_SIMS], "sims")
    delete_campaign(PersistentValues[CAMPAIGN_UP], "up")
    personalize.delete_solution(solutionArn=PersistentValues[SOLUTION_SIMS])
    personalize.delete_solution(solutionArn=PersistentValues[SOLUTION_UP])
    delete_filter(PersistentValues[FILTER_UP])
    delete_dataset([PersistentValues[TITLE_DATASET], PersistentValues[USER_DATASET], PersistentValues[TITLE_READ_DATASET]])
    delete_dataset_group(PersistentValues[DSG])
    delete_schemas([PersistentValues[TITLE], PersistentValues[USER], PersistentValues[TITLE_READ]])

    # s3 bucket 삭제
    delete_bucket()

    # pinpoint 관련 리소스 삭제
    delete_campaign()
    delete_segment()
    delete_email_template()
    delete_recommender_configuration()
    delete_app()

    # lambda 삭제
    delete_function()

    # iam(role, policy) 삭제
    delete_role_and_policy(S3_ROLE_NAME, PersistentValues[S3_POLICY_NAME], PersistentValues[S3_ROLE_NAME])
    delete_role_and_policy(LAMBDA_ROLE_NAME, PersistentValues[LAMBDA_POLICY_NAME], PersistentValues[LAMBDA_ROLE_NAME])
    delete_role_and_policy(ML_ROLE_NAME, PersistentValues[ML_POLICY_NAME], PersistentValues[ML_ROLE_NAME])
