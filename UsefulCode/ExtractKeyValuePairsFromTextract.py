import boto3
from collections import defaultdict
import json

def lambda_handler(event, context):
    ACCESS_KEY = '***'
    SECRET_KEY = '***'
    
    client = boto3.client('textract', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
    
    Document = {'S3Object': {'Bucket': '***', 'Name': '***'}}
    FeatureTypes = ['FORMS']
    
    response = client.analyze_document(Document=Document, FeatureTypes=FeatureTypes)
    
    key_map, value_map, block_map = get_kv_map(response)

    # get list of key-value relationships
    kvs = get_kv_relationship(key_map, value_map, block_map)

    return {
        'statusCode': 200,
        'body': json.dumps(kvs)
    }

def get_kv_map(textract_response):
    # Get the text blocks
    blocks = textract_response['Blocks']

    # get key and value maps
    key_map = {}
    value_map = {}
    block_map = {}
    for block in blocks:
        block_id = block['Id']
        block_map[block_id] = block
        if block['BlockType'] == "KEY_VALUE_SET":
            if 'KEY' in block['EntityTypes']:
                key_map[block_id] = block
            else:
                value_map[block_id] = block

    return key_map, value_map, block_map

def get_kv_relationship(key_map, value_map, block_map):
    kvs = defaultdict(list)
    for block_id, key_block in key_map.items():
        value_block = find_value_block(key_block, value_map)
        key = get_text(key_block, block_map)
        val = get_text(value_block, block_map)
        kvs[key].append(val)
    return kvs

def find_value_block(key_block, value_map):
    for relationship in key_block['Relationships']:
        if relationship['Type'] == 'VALUE':
            for value_id in relationship['Ids']:
                value_block = value_map[value_id]
    return value_block

def get_text(result, blocks_map):
    text = ''
    if 'Relationships' in result:
        for relationship in result['Relationships']:
            if relationship['Type'] == 'CHILD':
                for child_id in relationship['Ids']:
                    word = blocks_map[child_id]
                    if word['BlockType'] == 'WORD':
                        text += word['Text'] + ' '
                    if word['BlockType'] == 'SELECTION_ELEMENT':
                        if word['SelectionStatus'] == 'SELECTED':
                            text += 'X '

    return text