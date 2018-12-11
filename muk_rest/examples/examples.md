# Examples

Here you can find some examples of how you can use the REST API.

## Python

```python
import json
import requests

from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import LegacyApplicationClient

client_id = 'LegacyApplicationFlowDemoClientKey'
client_secret = 'LegacyApplicationFlowDemoClientSecret'
token_url = 'https://demo12.mukit.at/api/authentication/oauth2/token'

username = 'demo'
password = 'demo'
scope = ['all']

oauth = OAuth2Session(
    client=LegacyApplicationClient(client_id=client_id)
)
token = oauth.fetch_token(
    token_url=token_url, 
    username=username, password=password,
    client_id=client_id, client_secret=client_secret
)

print(oauth.get("https://demo12.mukit.at/api/user").json())
```
