import json
import requests

BASE = 'https://demo.mukit.at'

def url(url):
    if url.startswith('/'):
        url = "%s%s" % (BASE, url)
    return url
	
def authentication():
    response = requests.post(
        url('/api/authenticate'),
        data = {
            'db': "demo",
            'login': "demo",
            'password': "demo"})
    return response.json()['token']

# Test API
print(requests.get(url('/api')).json())

# Authenticate
print(authentication())

# Use API
token = authentication()

data = {'token': token, 'context': '{"bin_size": "True"}', 'id': 1}
response = requests.get(url('/api/search'), data=data).json()
print(json.dumps(response, indent=4, sort_keys=True))
