import base64
import io
import json
import sys

import requests
from PIL import Image


def decode_img(msg):
    newsize = (300, 200)
    msg = base64.b64decode(msg)
    buf = io.BytesIO(msg)
    img = Image.open(buf)
    img.thumbnail(newsize)
    buf = io.BytesIO()
    img.save(buf, 'PNG')
    buf.seek(0)
    img_bytes = buf.read()
    base64_encoded_result_bytes = base64.b64encode(img_bytes)
    return base64_encoded_result_bytes.decode('utf-8')


id = sys.argv[1]
resp = requests.get('http://localhost:8082/api/base64/' + id)
jsonData = json.loads(resp.content.decode("utf-8"))
message = jsonData['data']
print(decode_img(message))
