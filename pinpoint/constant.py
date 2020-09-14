#!/usr/bin/env python3

REGION = 'ap-northeast-2'

BUCKET_NAME = 'pinpoint-test-eunhye'
SEGMENT_PATH = 'results/by-user-id/test.csv'

POLICY_NAME = 'PinpointS3BucketAccessPolicy'
ROLE_NAME = 'PinpointS3BucketAccessRole'

APPLICATION_NAME = 'competition'
SEGEMENT_NAME = 'segment'
CAMPAIGN_NAME = 'campaign'
EMAIL_NAME = 'email'

ADDRESS = 'eunhye.ju@deliveryhero.co.kr'
SES_IDENTITY = f'arn:aws:ses:ap-northeast-2:338829956819:identity/{ADDRESS}'

PERSISTENT_VALUE_FILE_PATH = '.persistent_values'

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