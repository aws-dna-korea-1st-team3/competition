# Making Data Meaningless

만화경 로그 데이터를 외부에 공개할 수 있도록 무의미하게 변경합니다.

## input
`./input` directory 이하에 `.csv`파일들을 넣습니다. csv의 포맷은 다음과 같습니다.

```
dvc_id,name,id,log_date
bb50112c-5f41-49b6-a6ff-426b4b68c066,개구리공주,25,2020-05-31 15:00:58.751
eff27a75-69de-445e-98cf-c3d9302369b3,나의 연애 D-day,37,2020-05-31 15:01:06.823
```

## output
`./output` directory 이하에 .csv파일이 생성됩니다. dvc_id는 무작위로 생성된 uuid로 교체되고 id는 기존의 id값 범위 안에서 다른 값으로 변경됩니다.

## run

```sh
go run run.go title-read # title-read는 output파일의 prefix
```
