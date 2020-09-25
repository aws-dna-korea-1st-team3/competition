# Recommendation System

## Setup

AWS Python SDK (boto3) 설치 

```sh
pip install boto3
```

`~/.aws/config`에 default로 지정되어있는 access_key와 secret_access_key를 사용합니다. 참고: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html

constant.py의 BUCKET_NAME을 api를 셋업하면서 생성한 BUCKET_NAME으로 교체해주세요.

```py3
# 예)
BUCKET_NAME = "team3-recommendation-api-data7e2128ca-1gla8bnj0ry2p"
```

constant.py의 ADDRESS를 자신의 메일로 바꿔주세요.(AWS SES에서 사전 인증 필요) 

```py3
# 예)
ADDRESS = "your@email.com"
```

`data/user/pinpoint/segment_import.csv`의 이메일을 자신의 것으로 변경해주세요. (Pinpoint Sandbox 환경에서는 메일 발송의 제한이 있을 수 있음)

```csv
ChannelType,Address,User.UserId
EMAIL,your@email.com,007e2923-dc99-440f-b1db-bc97af34a412
```

setup.py를 실행합니다. 버킷 생성부터 추천 데이터 추출까지 자동으로 진행합니다.

```sh
python3 setup.py
```

`~/.aws/config`의 다른 프로필을 사용하려면 아래처럼 실행합니다.

```sh
AWS_PROFILE=profile_name python3 setup.py
```

### Destroy

```sh
python3 destroy.py
```

Setup에서 설정한 리소스를 모두 제거합니다. 약 10~20분 정도 걸립니다.
