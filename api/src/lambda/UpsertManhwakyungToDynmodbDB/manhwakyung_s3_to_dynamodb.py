import json
import boto3
import os
import traceback
from datetime import datetime, timedelta

REGION_NAME = os.getenv('REGION_NAME', 'ap-northeast-2')
DDB_SIMS_TABLE = os.getenv('DDB_SIMS_TABLE', 'RecommendationSIMS')

s3 = boto3.client('s3', region_name=REGION_NAME)
ddb = boto3.resource('dynamodb', region_name=REGION_NAME)


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    try:
        s3_obj = s3.get_object(Bucket=bucket, Key=key)
        datas = s3_obj['Body'].read().decode('utf-8').splitlines()
        
        for index, data in enumerate(datas):
            jsonString = json.loads(data)
            itemId = jsonString['input']['itemId']
            recommendedItems = ', '.join(jsonString['output']['recommendedItems'])
            updated_time = str(datetime.now() + timedelta(hours=9))
            #print("idx={}, itemId={}, recommendedItems={}, update_time: {}".format(index, itemId, recommendedItems, updated_time))

            table = ddb.Table(DDB_SIMS_TABLE)
            table.put_item(
                Item={
                    'itemid': itemId,
                    'recomm_item': recommendedItems,
                    'updated_time': updated_time
                }
            )
            
    except Exception as e:
        traceback.print_exc()
        return "failed"
        
    return "success"
        
if __name__ == '__main__':
    event = {
              "Records": [
                {
                  "eventVersion": "2.1",
                  "eventSource": "aws:s3",
                  "awsRegion": "ap-northeast-2",
                  "eventTime": "2020-08-29T15:30:47.614Z",
                  "eventName": "ObjectCreated:Put",
                  "userIdentity": {
                    "principalId": "A2G8AFPRR2FRE3"
                  },
                  "requestParameters": {
                    "sourceIPAddress": "127.0.0.1"
                  },
                  "responseElements": {
                    "x-amz-request-id": "34E3B2D0DE3D34F8",
                    "x-amz-id-2": "1WxhFIbYLQhEVmj3ZjttvPFZl3zeoLhL0L10aKTkGoYcTsTbilJlqGds5iAv2LfaqXwn8HT+dnJECcceuH13rMpdKB8gn4GAZCLh1tS1aSg="
                  },
                  "s3": {
                    "s3SchemaVersion": "1.0",
                    "configurationId": "95902beb-e3d3-4643-b269-3d3eef584862",
                    "bucket": {
                      "name": "team3-recommendation-system-personalize-data-jhhwang",
                      "ownerIdentity": {
                        "principalId": "A2G8AFPRR2FRE3"
                      },
                      "arn": "arn:aws:s3:::team3-recommendation-system-personalize-data-jhhwang"
                    },
                    "object": {
                      "key": "results/by-title-id/batch-input.txt.out",
                      "size": 9361,
                      "eTag": "adf925a7bf3132f7726dd005a4d437a9",
                      "sequencer": "005F4A74A8A6EBF143"
                    }
                  }
                }
              ]
            }
            
    res = lambda_handler(event, {})
    print("result: " + res)
