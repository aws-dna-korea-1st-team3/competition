# Recommendation System

## Setup

`~/.aws/config`에 default로 지정되어있는 access_key와 secret_access_key를 사용합니다. 참고: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html

constant.py의 BUCKET_NAME의 마지막 숫자를 임의의 숫자로 바꿔주세요.

```py3
# 예)
BUCKET_NAME = "team3-recommendation-system-personalize-data-348521"
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

    create_role() # Personalize를 위한 IAM Role 및 Policy 생성

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

    ### 아래 세 작업 총 합해서 1시간 ~ 1시간 30분 소요

    # Persoanlize Solution및 Solution Version 생성
    create_solution(PersistentValues[DSG])

    # Persoanlize Campaign 생성
    create_campaign(PersistentValues[SOLUTION_VERSION])

    # Batch Inference Job을 생성해서 훈련이 완료된 모델에서 모든 작품에 대한 추천 작품 데이터를 뽑아 S3에 저장
    # S3 버킷의 data/title/batch-input.txt 파일에 모든 작품에 대한 id가 있고, 이 파일이 batch의 input으로 들어간다.
    # batch의 output은 S3 버킷의 results/by-title-id/batch-input.txt.out 에 저장됨.
    create_batch_inference_job(solutionVersionArn=PersistentValues[SOLUTION_VERSION], roleArn=PersistentValues[ROLE])
```

### Destroy

```sh
python3 destroy.py
```

Setup에서 설정한 리소스를 모두 제거합니다. 약 10~20분 정도 걸립니다.
