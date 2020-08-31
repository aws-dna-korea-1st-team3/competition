import os
import json
import boto3
import traceback

REGION_NAME = os.getenv('REGION_NAME', 'ap-northeast-2')
DDB_SIMS_TABLE = os.getenv('DDB_SIMS_TABLE', 'RecommendationSIMS')
DEF_ITEM_LIMIT = int(os.getenv('DEF_ITEM_LIMIT', "10"))

ddb = boto3.resource('dynamodb', region_name=REGION_NAME)

def process_by_titles(table):
    # fetch all recommendation data from the database
    result = table.scan()

    # create a response
    response = {
        "statusCode": 200,
        "body": json.dumps(result['Items'], indent=4)
    }

    return response

def process_by_title_id(table, event):
    try:
        if 'limit' in event['queryStringParameters']:
            limit = int(event['queryStringParameters']['limit'])
        else:
            limit = DEF_ITEM_LIMIT
    except Exception as ex:
        limit = DEF_ITEM_LIMIT

    try:
        # fetch recommendation data from the database
        result = table.get_item(
            Key={
                'itemid': event['pathParameters']['id']
            }
        )
        
        result['Item']['itemid'] = int(result['Item']['itemid'])
     
        items = result['Item']['recomm_item'].split(", ")
        items = items[0:limit]
        result['Item']['recomm_item'] = ', '.join(items)
        
        response = {
            "statusCode": 200,
            "body": json.dumps(result['Item'], indent=4)
        }
        return response
    except Exception as ex:
        traceback.print_exc()
        response = {
            'statusCode': 200,
            'body': '{}'
        }
        return response
        
def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=4))
    table = ddb.Table(DDB_SIMS_TABLE)

    if event['pathParameters'] is None:
        response = process_by_titles(table)
    else:
        response = process_by_title_id(table, event)
    
    return response
        
if __name__ == '__main__':
    event = {
              "resource": "/recommended-titles/by-title/{id}",
              "path": "/recommended-titles/by-title/11",
              "httpMethod": "GET",
              "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "Host": "uiabaen3n9.execute-api.ap-northeast-2.amazonaws.com",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
                "X-Amzn-Trace-Id": "Root=1-5f4baa11-d5cdec827725316241a73897",
                "X-Forwarded-For": "221.150.15.214",
                "X-Forwarded-Port": "443",
                "X-Forwarded-Proto": "https"
              },
              "multiValueHeaders": {
                "accept": [
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
                ],
                "accept-encoding": [
                  "gzip, deflate, br"
                ],
                "accept-language": [
                  "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
                ],
                "Host": [
                  "uiabaen3n9.execute-api.ap-northeast-2.amazonaws.com"
                ],
                "sec-fetch-dest": [
                  "document"
                ],
                "sec-fetch-mode": [
                  "navigate"
                ],
                "sec-fetch-site": [
                  "none"
                ],
                "sec-fetch-user": [
                  "?1"
                ],
                "upgrade-insecure-requests": [
                  "1"
                ],
                "User-Agent": [
                  "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
                ],
                "X-Amzn-Trace-Id": [
                  "Root=1-5f4baa11-d5cdec827725316241a73897"
                ],
                "X-Forwarded-For": [
                  "221.150.15.214"
                ],
                "X-Forwarded-Port": [
                  "443"
                ],
                "X-Forwarded-Proto": [
                  "https"
                ]
              },
              "queryStringParameters": {
                "limit": "5"
              },
              "multiValueQueryStringParameters": {
                "limit": [
                  "5"
                ]
              },
              "pathParameters": {
                "id": "11"
              },
              "stageVariables": None,
              "requestContext": {
                "resourceId": "d75zbg",
                "resourcePath": "/recommended-titles/by-title/{id}",
                "httpMethod": "GET",
                "extendedRequestId": "SFeC0FgpoE0Fbag=",
                "requestTime": "30/Aug/2020:13:30:57 +0000",
                "path": "/v1/recommended-titles/by-title/11",
                "accountId": "047010960897",
                "protocol": "HTTP/1.1",
                "stage": "v1",
                "domainPrefix": "uiabaen3n9",
                "requestTimeEpoch": 1598794257953,
                "requestId": "c48dcd44-d37f-46de-a19d-5a614a0aaec2",
                "identity": {
                  "cognitoIdentityPoolId": None,
                  "accountId": None,
                  "cognitoIdentityId": None,
                  "caller": None,
                  "sourceIp": "221.150.15.214",
                  "principalOrgId": None,
                  "accessKey": None,
                  "cognitoAuthenticationType": None,
                  "cognitoAuthenticationProvider": None,
                  "userArn": None,
                  "userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
                  "user": None
                },
                "domainName": "uiabaen3n9.execute-api.ap-northeast-2.amazonaws.com",
                "apiId": "uiabaen3n9"
              },
              "body": None,
              "isBase64Encoded": False
            }
            
    res = lambda_handler(event, {})
    print("result: " + json.dumps(res, indent=4))

