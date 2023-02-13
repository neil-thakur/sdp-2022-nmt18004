import json

f = open('/Users/neil-thakur/src/sdp-2022-nmt18004/DecodingAWSTextractJSON/analyzeDocResponse.json')
data = json.load(f)

print("PRIMARY JSON STRUCTURE:")
for key in data:
    print('\t', key)
print()

blocks = data['Blocks']

for block in blocks:
    for key in block:
        if key == 'Text':
            print(key, " ", block[key])

f.close()
