import json

f = open('analyzeDocResponse.json')
data = json.load(f)
blocks = data['Blocks']

for block in blocks:
    for key in block:
        if key == 'Text':
            print(key, " ", block[key])

f.close()
