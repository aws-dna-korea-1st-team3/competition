# Making Data Meaningless

만화경 로그 데이터를 외부에 공개할 수 있도록 무의미하게 변경합니다.

## input

### 작품

`./input/title/title.csv` 파일입니다. csv의 포맷은 다음과 같습니다.

```
ITEM_ID,CREATION_TIMESTAMP,TITLE
"1","2019-08-16 04:48:10.032","개구리공주"
"2","2019-08-16 04:50:12.047","하루의 끝을 당신과"
```

### 사용자-작품 조회 데이터

`./input/title-read` directory 이하에 `.csv`파일들을 넣습니다. csv의 포맷은 다음과 같습니다.

```
"USER_ID","ITEM_ID","TIMESTAMP","TITLE","EVENT_TYPE"
"38eb3ddb-3277-4ab9-b293-969c451314a5","4","2020-01-26 11:39:07.443","별일 없이 산다","title-read"
```

## output
`./output` directory 이하에 .csv파일이 생성됩니다. USER_ID는 무작위로 생성된 uuid로 교체되고 작품의 ITEM_ID는 기존의 값 범위 안에서 다른 값으로 변경됩니다.

## run

```sh
go run run.go
```
