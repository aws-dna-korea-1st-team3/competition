# 만화경 추천 시스템 Frontend

## 설치

아래 내용에 따라 셋팅한 뒤 `cdk deploy`를 실행하면 s3에  `recommendation-frontend-manhwakyungrecommendation-무작위문자열` 이라는 버킷이 만들어집니다.

버킷의 Properties -> Static website hosting을 보면 웹사이트에 접속할 수 있는 URL을 알 수 있습니다.

## 삭제

**`cdk destroy`를 실행하기 전에 버킷의 모든 내용을 제거해야 버킷까지 제거됩니다. 버킷을 비운 뒤 `cdk destroy`를 실행합니다.** 

## Welcome to your CDK Python project!

This is a blank project for Python development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

This project is set up like a standard Python project.  The initialization
process also creates a virtualenv within this project, stored under the .env
directory.  To create the virtualenv it assumes that there is a `python3`
(or `python` for Windows) executable in your path with access to the `venv`
package. If for any reason the automatic creation of the virtualenv fails,
you can create the virtualenv manually.

To manually create a virtualenv on MacOS and Linux:

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

To add additional dependencies, for example other CDK libraries, just add
them to your `setup.py` file and rerun the `pip install -r requirements.txt`
command.

## Useful commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

Enjoy!
