## CDK 
* API Gateway
* Lambda
* DynamoDB

### CDK Deploy
```
$ cd api  
$ python3 -m venv .env
$ source .env/bin/activate
$ npm install -g aws-cdk
$ pip install -r requirements.txt  
$ cdk synthesize  
$ cdk bootstrap  
$ cdk deploy  
```

cdk deploy가 정상적으로 완료된 경우 Output 결과가 나오게 됩니다.  
Output 결과의 API Gateway Endpoint로 API를 요청하면 됩니다.
* Endpoint: https://pdeqhprr1h.execute-api.ap-northeast-2.amazonaws.com/v1/
* API GW ID: pdeqhprr1h
```
Outputs:
api-cdk.RecommendSimsByTitleEndpointD666D060 = https://pdeqhprr1h.execute-api.ap-northeast-2.amazonaws.com/v1/
```

`team3-recommendation-api-data무작위문자열`의 버킷이 만들어집니다. Personalize의 batch inference job 결과가 이 버킷에 저장되어야 합니다.

```sh
# 버킷 이름 확인
aws s3 ls | grep team3-recommendation-api-data
```


### CDK Destroy
```
$ cdk destroy
```

cdk destroy에서 S3 버킷 삭제 기능이 지원되지 않습니다.  
수동으로 S3 버킷 삭제를 하셔야 합니다.
```
$ aws s3 rb s3://{S3_BUCKET_NAME} --force
```

### Lambda에서 DynamoDB에 작품 추천 결과 저장 절차
1. Personalize의 batch job을 통해 추천 결과는 S3에 저장됩니다.  
   * {S3_BUCKET_NAME}/results/by-title-id/batch-input.txt.out
2. Lambda는 S3 버킷에 오브젝트(추천 결과)가 생성되거나 업데이트시 트리거 됩니다.  
   Lambda 트리거 테스트를 위해 수동으로 S3에 데이터를 생성/업데이트 합니다. (AWS Console or AWS CLI)
   ```  
   $ aws s3 cp batch-input.txt.out s3://{BUCKET_NAME}/results/by-title-id/batch-input.txt.out
   ```
3. DynamoDB의 RecommendationSIMS 테이블에 만화 추천 결과가 저장되었는지 확인합니다.

### DynamoDB Schema Design
| Partition key | Data Type | Description |  
|---------------|-----------|-------------|
| itemid        | String    | 작품 ID |   
 
 | Data Attribute | Data Type | Description |  
|---------------|-----------|-------------|
| recomm_item   | String    | 추천 작품 ID 목록 |
| updated_time   | String    | 업데이트 시간 |   
 
### RESTful API Specification
| Method | URL Example | Description |  
|--------|------------------|-----------|
| GET    | /v1/recommended-titles/by-title | 전체 추천 결과 조회 (Recipe: SIMS) |  
| GET    | /v1/recommended-titles/by-title/{id} | 작품에 대한 추천 작품을 조회 (Recipe: SIMS) | 

#### 추천 결과 리스트 조회
- Request
  - GET /v1/recommended-titles/by-title
 
    | Key | Required(Yes/No) | Data Type | Description |  
    |-----|------------------|-----------|-------------|
    | - | - | - | - |
    
    ```
    $ curl -X GET "https://{APIGW_ID}.execute-api.ap-northeast-2.amazonaws.com/v1/recommended-titles/by-title"
    ``` 
- Response
```
[
    {
        "recomm_item": "52, 37, 28, 36, 39, 17, 2, 3, 16, 51, 45, 5, 34, 12, 20, 18, 4, 41, 27, 8, 47, 6, 24, 43, 35",
        "updated_time": "2020-08-31 12:13:39.194063",
        "itemid": "22"
    },
    {
        "recomm_item": "27, 34, 4, 35, 45, 17, 51, 19, 12, 38, 5, 41, 30, 14, 20, 7, 3, 54, 44, 23, 43, 24, 36, 2, 8",
        "updated_time": "2020-08-31 12:13:38.898324",
        "itemid": "18"
    },
    {
        "recomm_item": "4, 54, 51, 3, 47, 2, 44, 17, 27, 49, 38, 8, 34, 45, 18, 6, 12, 23, 20, 41, 5, 24, 39, 37, 28",
        "updated_time": "2020-08-31 12:13:38.754279",
        "itemid": "16"
    },
    {
        "recomm_item": "8, 54, 16, 37, 43, 44, 6, 23, 34, 17, 18, 27, 10, 38, 20, 14, 51, 39, 41, 35, 45, 12, 47, 3, 5",
        "updated_time": "2020-08-31 12:13:37.754158",
        "itemid": "2"
    },
    {
        "recomm_item": "52, 37, 28, 36, 39, 17, 2, 3, 16, 51, 45, 5, 34, 12, 20, 18, 4, 41, 27, 8, 47, 6, 24, 43, 35",
        "updated_time": "2020-08-31 12:13:38.534056",
        "itemid": "13"
    }
    .... 이하 생략 ....
]
```
    
#### 작품에 대한 작품 추천 결과
- Request
  - GET /v1/recommended-titles/by-title/{id}
 
    | Key | Required(Yes/No) | Data Type | Description |  
    |-----|------------------|-----------|-------------|
    | id | Yes | String | 작품 ID |
    | limit | No | Integer | 검색 결과 개수 (기본 값: 10)  |
    
    ```
    $ curl -X GET "https://{APIGW_ID}.execute-api.ap-northeast-2.amazonaws.com/v1/recommended-titles/by-title/12"
    $ curl -X GET "https://{APIGW_ID}.execute-api.ap-northeast-2.amazonaws.com/v1/recommended-titles/by-title/12?limit=5"
    ``` 
- Response
```
{
    "recomm_item": "27, 45, 20, 18, 44",
    "updated_time": "2020-08-31 12:13:38.458292",
    "itemid": 12
}
```


