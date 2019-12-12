import base64
import io
import json
import sys
import requests
from PIL import Image


def decode_img(message):
    new_size = (300, 200)
    message = base64.b64decode(message)
    buffor = io.BytesIO(message)
    img = Image.open(buffor)
    img.thumbnail(new_size)
    buffor = io.BytesIO()
    img.save(buffor, 'PNG')
    buffor.seek(0)
    img_bytes = buffor.read()
    base64_encoded_result_bytes = base64.b64encode(img_bytes)
    return base64_encoded_result_bytes.decode('utf-8')


id = sys.argv[1]
response = requests.get('http://localhost:8082/api/base64/' + id)
jsonData = json.loads(response.content.decode("utf-8"))
message = jsonData['data']
print(decode_img(message))
