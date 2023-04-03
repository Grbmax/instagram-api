import json

# open the input file
with open('linted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
unique = []
duplicates = []

for obj in data:
    pk = obj['pk']
    if pk not in unique:
        unique.append(pk)
    else:
        duplicates.append(pk)
    count += 1

print(f"Duplicate Objects: {len(duplicates)}")

