import boto3, logging
from botocore.exceptions import ClientError

REGION = 'ap-northeast-2'
BUCKET_NAME = 'pinpoint-test-eunhye'
SEGMENT_PATH = 'results/by-user-id/test.csv'
POLICY_NAME = 'PinpointS3BucketAccessPolicy'
ROLE_NAME = 'PinpointS3BucketAccessRole'
APPLICATION_NAME = 'competition'
ADDRESS = 'eunhye.ju@deliveryhero.co.kr'
SES_IDENTITY = f'arn:aws:ses:ap-northeast-2:338829956819:identity/{ADDRESS}'
HTML_TEXT = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body> 안녕하세요, {{User.UserId}}님,<div><br></div>
    <div>만화 추천드립니다.<div><br></div>
        <div>1. {{Attributes.Recommandationtitle1}}</div>
        <div>2. {{Attributes.Recommandationtitle2}}</div>
        <div>3. {{Attributes.Recommandationtitle3}}</div>
        <div>4. {{Attributes.Recommandationtitle4}}</div>
        <div>5. {{Attributes.Recommandationtitle5}}<br></div>
        <div><br></div>
        <div>DNA 3팀</div>
    </div>
</body>
</html>
'''

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
    iam.create_policy(PolicyName=POLICY_NAME,
                      PolicyDocument=POLICY)
    logger.info('Creating IAM Policy({}) >> Success'.format(POLICY_NAME))


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
    global role_arn
    role_arn = role_response['Role']['Arn']


def create_app():

    app_response = pinpoint.create_app(CreateApplicationRequest={
                                              'Name': APPLICATION_NAME})
    logger.info('Creating Pinpoint Application({}) >> Success'.format(APPLICATION_NAME))
    global app_id
    app_id = app_response['ApplicationResponse']['Id']


def update_email_channel():

    pinpoint.update_email_channel(ApplicationId=app_id,
                                  EmailChannelRequest={
                                         'Enabled': True,
                                         'Identity': SES_IDENTITY,
                                         'FromAddress': ADDRESS})
    logger.info('Enable Email Channel({}) >> Success'.format(APPLICATION_NAME))


def create_email_template():

    pinpoint.create_email_template(TemplateName=APPLICATION_NAME,
                                   EmailTemplateRequest={
                                          'HtmlPart': HTML_TEXT,
                                          'Subject': APPLICATION_NAME})
    logger.info('Creating Email Template({}) >> Success'.format(APPLICATION_NAME))


def create_import_job():

    segment_response = pinpoint.create_import_job(ApplicationId=app_id,
                                                  ImportJobRequest={
                                                         'Format': 'CSV',
                                                         'RoleArn': role_arn,
                                                         'S3Url': f's3://{BUCKET_NAME}{SEGMENT_PATH}'})
    logger.info('Creating Segment({}) >> Success'.format(APPLICATION_NAME))
    global segment_id
    segment_id = segment_response['Definition']['SegmentId']


def create_campaign():

    pinpoint.create_campaign(ApplicationId=app_id,
                             WriteCampaignRequest={
                                     'Name': APPLICATION_NAME,
                                     'SegmentId': segment_id,
                                     'TemplateConfiguration': {
                                           'EmailTemplate': {
                                               'Name': APPLICATION_NAME}},
                                     'Schedule': {
                                            'StartTime': 'IMMEDIATE',
                                            'Timezone': 'UTC+09'}})
    logger.info('Creating Campaign({}) >> Success'.format(APPLICATION_NAME))


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