# Preprocessing

## 구조

리소스
- [S3] webtoon-data
- [S3] webtoon-transformed-data
- [Glue] DataCatalog/database
- [Glue] DataCatalog/table
- [Athena] Workgroup
- [Athena] CTAS Query
- [EventBridge] LambdaTrigger
- [Lambda] ExecuteAthenaQuery

## 시나리오
1. 사용자 로그는 CSV 파일 포맷으로 `webtoon-data` S3 버킷에 쌓이게 된다.
2. title-read, title, user 정보는 각각 미리 정의되어 Glue의 데이터 카탈로그에 데이터베이스와 테이블로 생성되어 있다.
3. `personalize`에서 요구하는 파일 포맷인 avro 파일 포맷으로 변경이 필요하다.
4. 이 부분을 `lambda`에서 `Athena` 쿼리를 실행하여 S3에 쌓여 있는 CSV 파일에 CTAS(Create Table As Select) 쿼리를 날려서 avro 포맷으로 변환한다.
5. avro 포맷으로 변경된 파일은 `webtoon-transformed-data` 버킷에 쌓이게 된다.
6. 쿼리를 실행하는 람다는 Daily batch로 `EventBridge(CloudWatch Event)`에서 트리거링해준다.


## Command
```
$ python3 -m venv .env
```

After the init process completes and the virtualenv is created, you can use the following
step to activate your virtualenv.

```
$ source .env/bin/activate
```

If you are a Windows platform, you would activate the virtualenv like this:

```
% .env\Scripts\activate.bat
```

Once the virtualenv is activated, you can install the required dependencies.

```
$ pip install -r requirements.txt
```

At this point you can now synthesize the CloudFormation template for this code.

```
$ cdk synth
```

You can now begin exploring the source code, contained in the hello directory.
There is also a very trivial test included that can be run like this:

```
$ pytest
```

To add additional dependencies, for example other CDK libraries, just add to
your requirements.txt file and rerun the `pip install -r requirements.txt`
command.

## Useful commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

Enjoy!
