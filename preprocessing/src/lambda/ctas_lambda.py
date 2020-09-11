import boto3
import os
import datetime

BUCKET_NAME = os.getenv('BUCKET_NAME')
DATABASE_NAME = os.getenv('DATABASE_NAME', "dna_database")
ATHENA_WORKGROUP = os.getenv('ATHENA_WORKGROUP', "dna")



CTAS_QUERY_FMT = '''CREATE TABLE {database_name}.{ctas_table_name}
WITH (
  format='AVRO',
  external_location='s3://{bucket_name}/{directory}'
) AS
SELECT * FROM {database_name}.{origin_table_name};
'''




def run_ctas(athena_client, basic_dt, data_name):
    year, month, day, hour = (basic_dt.year, basic_dt.month, basic_dt.day, basic_dt.hour)

    new_table_name = '{table}_{year}{month:02}{day:02}'.format(table=str(data_name).replace("-", "_"),
                                                               year=year, month=month, day=day)


    query = CTAS_QUERY_FMT.format(database_name=DATABASE_NAME, ctas_table_name=new_table_name, bucket_name=BUCKET_NAME,
                                  directory=data_name, origin_table_name=str(data_name).replace("-", "_")+"_table")

    print('[INFO] QueryString:\n{}'.format(query))

    response = athena_client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={
            'Database': DATABASE_NAME
        },
        ResultConfiguration={
            'OutputLocation': "s3://{}/query_result".format(BUCKET_NAME)
        },
        WorkGroup=ATHENA_WORKGROUP
    )
    print('[INFO] the response of CTAS query : ', response)


def lambda_handler(event, context):
    print('[INFO] event = ', event)
    event_date = datetime.datetime.strptime(event['time'], "%Y-%m-%dT%H:%M:%SZ")
    client = boto3.client('athena')
    run_ctas(client, event_date, "title")
    run_ctas(client, event_date, "title-read")
    run_ctas(client, event_date, "user")


if __name__ == '__main__':

    event = {
    "time" : "2020-09-12T00:00:00Z"
    }
    lambda_handler(event, {})
