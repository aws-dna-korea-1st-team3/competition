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

constant.py의 ADDRESS를 자신의 메일로 바꿔주세요.(AWS SES에서 인증 필요) 

```py3
# 예)
ADDRESS = "your@email.com"
```

`data/user/pinpoint_import.csv`의 이메일과 휴대폰 번호도 자신의 것으로 변경해주세요.

```csv
ChannelType,Address,User.UserId,Id
EMAIL,your@email.com,007e2923-dc99-440f-b1db-bc97af34a412,endpoint1
SMS,1012345678,007e2923-dc99-440f-b1db-bc97af34a412,endpoint2
```

이후에 boto3를 설치하고 setup.py를 실행합니다.

```sh
pip install boto3
python3 setup.py
```

`~/.aws/config`의 다른 프로필을 사용하려면 아래처럼 실행합니다.

```sh
AWS_PROFILE=profile_name python3 setup.py
```

`setup.py`를 실행하면 버킷 생성부터 추천 데이터 추출까지 자동으로 진행합니다. 메인 함수는 아래와 같습니다.

```py3
if __name__ == "__main__":
    create_bucket() # 버킷 생성
    add_bucket_policy() # 버킷 정책 설정
    upload_data() # data 디렉토리의 파일을 S3에 업로드

    create_s3_role() # Personalize, Pinpoint를 위한 IAM Role 및 Policy 생성

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

    # 이미 본 작품을 배재하고 추천하기 위한 필터 생성(User-Personalization에서 사용)
    create_filter(PersistentValues[DSG])

    ### sims recipe, user-personalization recipe 병렬로 진행(약 1시간 30분 ~ 2시간)
    asyncio.run(create_recommendation_data())

    # sims recipe(작품별 추천)

    # Persoanlize Solution및 Solution Version 생성
    create_sims_solution(PersistentValues[DSG])

    # Persoanlize Campaign 생성
    create_sims_campaign(PersistentValues[SOLUTION_VERSION])

    # Batch Inference Job을 생성해서 훈련이 완료된 모델에서 모든 작품에 대한 추천 작품 데이터를 뽑아 S3에 저장
    # S3 버킷의 data/title/batch-input-sims.txt 파일에 모든 작품에 대한 id가 있고, 이 파일이 batch의 input으로 들어간다.
    # batch의 output은 S3 버킷의 results/by-title-id/batch-input.txt.out 에 저장됨.
    create_sims_batch_inference_job(solutionVersionArn=PersistentValues[SOLUTION_VERSION], roleArn=PersistentValues[ROLE])

    # user-personalization recipe(사용자별 추천)

    # Persoanlize Solution및 Solution Version 생성
    create_up_solution(PersistentValues[DSG])

    # Persoanlize Campaign 생성
    create_up_campaign(PersistentValues[SOLUTION_VERSION])

    # Batch Inference Job을 생성해서 훈련이 완료된 모델에서 모든 작품에 대한 추천 작품 데이터를 뽑아 S3에 저장
    # S3 버킷의 data/user/batch-input-up.txt 파일에 모든 작품에 대한 id가 있고, 이 파일이 batch의 input으로 들어간다.
    # batch의 output은 S3 버킷의 results/by-user-id/ 이하에 저장됨.
    create_up_batch_inference_job(solutionVersionArn=PersistentValues[SOLUTION_VERSION], roleArn=PersistentValues[ROLE])

    create_lambda_role() # lambda를 위한 IAM Role 및 Policy 생성
    create_ml_role() # ML(pinpoint)를 위한 IAM Role 및 Policy 생성

    create_function() # title id를 title로 변경해줄 lambda 생성
    add_permission() # lambda에 권한 넣어줌

    create_app() # pinpoint application 생성
    update_email_channel() # 이메일 채널 활성화

    create_recommender_configuration() # personalize와 연결된 추천 모델 생성 (권한 생성 필요)
    create_email_template() # 이메일 템플릿 생성

    create_import_job() # segment 생성
    create_campaign() # cmapaign 생성


```

### Destroy

```sh
python3 destroy.py
```

Setup에서 설정한 리소스를 모두 제거합니다. 약 10~20분 정도 걸립니다.
