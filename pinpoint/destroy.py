#!/usr/bin/env python3

import boto3, logging
from constant import REGION, BUCKET_NAME, SEGMENT_PATH, POLICY_NAME, ROLE_NAME, APPLICATION_NAME, SEGEMENT_NAME, CAMPAIGN_NAME, EMAIL_NAME, ADDRESS, SES_IDENTITY, HTML_TEXT
from persistent_value import PersistentValues, write

pinpoint = boto3.client('pinpoint', region_name=REGION)
s3 = boto3.client('s3', region_name=REGION)
iam = boto3.client('iam')

def delete_policy():

    iam.delete_policy(PolicyArn=PersistentValues[POLICY_NAME])
    logger.info('Deleting IAM Policy({}) >> Success'.format(POLICY_NAME))

def delete_role():

    iam.delete_role(RoleName=ROLE_NAME)
    logger.info('Deleting IAM Role({}) >> Success'.format(ROLE_NAME))

def delete_campaign():

    pinpoint.delete_campaign(ApplicationId=APPLICATION_NAME,
                             CampaignId=PersistentValues[CAMPAIGN_NAME])
    logger.info('Deleting Campaign({}) >> Success'.format(CAMPAIGN_NAME))

def delete_email_template():

    pinpoint.delete_email_template(TemplateName=APPLICATION_NAME)
    logger.info('Deleting Email Template({}) >> Success'.format(EMAIL_NAME))

def delete_segment():

    pinpoint.delete_segment(ApplicationId=APPLICATION_NAME,
                            SegmentId=PersistentValues[SEGEMENT_NAME])
    logger.info('Deleting Segment({}) >> Success'.format(SEGEMENT_NAME))

def delete_app():

    pinpoint.delete_app(ApplicationId=APPLICATION_NAME)
    logger.info('Deleting Application({}) >> Success'.format(APPLICATION_NAME))

if __name__ == "__main__":

    logger = logging.getLogger("competition")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter('%(asctime)s : %(message)s')

    stream_hander = logging.StreamHandler()
    stream_hander.setFormatter(formatter)
    logger.addHandler(stream_hander)

    file_handler = logging.FileHandler('my.log')
    logger.addHandler(file_handler)

    logger.info('Start destroy.py')

    delete_policy()
    delete_role()

    delete_campaign()
    delete_email_template()
    delete_segment()
    delete_app()

