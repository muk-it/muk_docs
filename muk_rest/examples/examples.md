# Examples

Here you can find some examples of how you can use the REST API.

## [Python](https://github.com/muk-it/muk_docs/blob/12%2C0/muk_rest/examples/example.py)

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

## [PHP](https://github.com/muk-it/muk_docs/blob/12%2C0/muk_rest/examples/example.php)

```php
  $provider = new \League\OAuth2\Client\Provider\GenericProvider([
    'clientId'                => 'LegacyApplicationFlowDemoClientKey',
    'clientSecret'            => 'LegacyApplicationFlowDemoClientSecret',
    'redirectUri'             => 'https://app.swaggerhub.com/oauth2_redirect/',
    'urlAuthorize'            => 'https://demo12.mukit.at/api/authentication/oauth2/authorize',
    'urlAccessToken'          => 'https://demo12.mukit.at/api/authentication/oauth2/token',
    'urlResourceOwnerDetails' => ''
  ]);
  
  try {
    $accessToken = $provider->getAccessToken('password', [
      'username' => 'demo',
      'password' => 'demo'      
    ]);
    $request = $provider->getAuthenticatedRequest(
      'GET',
      'https://demo12.mukit.at/api/user',
      $accessToken
    );
    $client = new \GuzzleHttp\Client();
    $response = $client->send($request);
    $rawBody = $response->getBody()->getContents();
    
    print_r($rawBody);
  } catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
    exit($e->getMessage());
  }
```
