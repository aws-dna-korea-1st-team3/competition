#!/usr/bin/env python3

import boto3, logging
from botocore.exceptions import ClientError
from constant import REGION, BUCKET_NAME, SEGMENT_PATH, POLICY_NAME, ROLE_NAME, APPLICATION_NAME, SEGEMENT_NAME, CAMPAIGN_NAME, EMAIL_NAME, ADDRESS, SES_IDENTITY, HTML_TEXT
from persistent_value import PersistentValues, write

pinpoint = boto3.client('pinpoint', region_name=REGION)
s3 = boto3.client('s3', region_name=REGION)
iam = boto3.client('iam')

def create_bucket():

    s3.create_bucket(Bucket=BUCKET_NAME,
                     CreateBucketConfiguration={
                         'LocationConstraint' : REGION})
    logger.info('Creating S3 {} >> Success'.format(BUCKET_NAME))


def upload_file():

    s3 = boto3.resource('s3')
    s3.meta.client.upload_file(SEGMENT_PATH, BUCKET_NAME, SEGMENT_PATH)
    logger.info('Uploading TEST File({}/{}) >> Success'.format(BUCKET_NAME, SEGMENT_PATH))


def create_policy():

    POLICY = f'''{{
    "Version": "2012-10-17",
    "Id": {POLICY_NAME},
    "Statement": [
        {{
            "Effect": "Allow",
            "Action": "s3:*"
            "Resource": [
                "arn:aws:s3:::{BUCKET_NAME}",
                "arn:aws:s3:::{BUCKET_NAME}/*"
            ]
        }}
    ]
}}'''
    policy_response = iam.create_policy(PolicyName=POLICY_NAME,
                                        PolicyDocument=POLICY)
    logger.info('Creating IAM Policy({}) >> Success'.format(POLICY_NAME))
    policy_arn = policy_response['Policy']['Arn']
    PersistentValues[POLICY_NAME] = policy_arn
    write(PersistentValues)


def create_role():

    ASSUME_POLICY = '''{
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
}'''
    role_response = iam.creat_role(RoleName=ROLE_NAME,
                                   AssumeRolePolicyDocument=ASSUME_POLICY,
                                   PermissionsBoundary=POLICY_NAME)
    logger.info('Creating IAM Role({}) >> Success'.format(ROLE_NAME))
    role_arn = role_response['Role']['Arn']
    PersistentValues[ROLE_NAME] = role_arn
    write(PersistentValues)


def create_app():

    app_response = pinpoint.create_app(CreateApplicationRequest={
                                              'Name': APPLICATION_NAME})
    logger.info('Creating Pinpoint Application({}) >> Success'.format(APPLICATION_NAME))
    app_id = app_response['ApplicationResponse']['Id']
    PersistentValues[APPLICATION_NAME] = app_id
    write(PersistentValues)


def update_email_channel():

    pinpoint.update_email_channel(ApplicationId=PersistentValues[APPLICATION_NAME],
                                  EmailChannelRequest={
                                         'Enabled': True,
                                         'Identity': SES_IDENTITY,
                                         'FromAddress': ADDRESS})
    logger.info('Enable Email Channel({}) >> Success'.format(APPLICATION_NAME))


def create_email_template():

    pinpoint.create_email_template(TemplateName=EMAIL_NAME,
                                   EmailTemplateRequest={
                                          'HtmlPart': HTML_TEXT,
                                          'Subject': EMAIL_NAME})
    logger.info('Creating Email Template({}) >> Success'.format(EMAIL_NAME))


def create_import_job():

    segment_response = pinpoint.create_import_job(ApplicationId=PersistentValues[APPLICATION_NAME],
                                                  ImportJobRequest={
                                                         'Format': 'CSV',
                                                         'RoleArn': PersistentValues[ROLE_NAME],
                                                         'S3Url': f's3://{BUCKET_NAME}{SEGMENT_PATH}',
                                                         'SegmentName': SEGEMENT_NAME})
    logger.info('Creating Segment({}) >> Success'.format(SEGEMENT_NAME))
    segment_id = segment_response['Definition']['SegmentId']
    PersistentValues[SEGEMENT_NAME] = segment_id
    write(PersistentValues)


def create_campaign():

    campaign_response = pinpoint.create_campaign(ApplicationId=PersistentValues[APPLICATION_NAME],
                                                 WriteCampaignRequest={
                                                        'Name': CAMPAIGN_NAME,
                                                        'SegmentId': PersistentValues[SEGEMENT_NAME],
                                                        'TemplateConfiguration': {
                                                                'EmailTemplate': {
                                                                      'Name': EMAIL_NAME}},
                                                        'Schedule': {
                                                                'StartTime': 'IMMEDIATE',
                                                                'Timezone': 'UTC+09'}})
    logger.info('Creating Campaign({}) >> Success'.format(CAMPAIGN_NAME))
    campaign_id = campaign_response['campaignArn']
    PersistentValues[CAMPAIGN_NAME] = campaign_id
    write(PersistentValues)


if __name__ == "__main__":

    logger = logging.getLogger("competition")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter('%(asctime)s : %(message)s')

    stream_hander = logging.StreamHandler()
    stream_hander.setFormatter(formatter)
    logger.addHandler(stream_hander)

    file_handler = logging.FileHandler('my.log')
    logger.addHandler(file_handler)

    create_bucket()
    upload_file()

    create_policy()
    create_role()

    create_app()
    update_email_channel()
    create_email_template()
    create_import_job()
    create_campaign()