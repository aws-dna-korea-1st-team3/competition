# Frontend

- [S3로 Static Web 배포하기](./recommendation_frontend/README.md)

## Setup

api를 배포한 뒤 얻은 endpoint를 `app/constants.ts`의 API 상수의 값으로 넣습니다. 그리고 frontend app을 배포한 뒤 cdk로 스태틱 웹사이트를 배포합니다.

```sh
# frontend build
cd app
npm install
npm run build

# deploy web app
cd ../recommendation_frontend
python3 -m venv .env
source .env/bin/activate
pip install -r requirements.txt
cdk bootstrap
cdk deploy
```

`team3-recommendation-frontend-web무작위문자열` 버킷의 Properties -> Static website hosting을 누르면 웹사이트에 접속할 수 있는 URL이 있습니다.

## Destroy

`team3-recommendation-frontend-web무작위문자열` 버킷의 모든 내용을 삭제한 이후에 `cdk destory`를 입력합니다.
