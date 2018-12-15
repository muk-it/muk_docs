<?php
  // HTTP Client (https://github.com/guzzle/guzzle)
  // OAuth 2.0 Client (https://github.com/thephpleague/oauth2-client)

  require_once('./vendor/autoload.php'); 
  
  $provider = new \League\OAuth2\Client\Provider\GenericProvider([
    'clientId'                => 'LegacyApplicationFlowDemoClientKey',    // The client ID assigned to you by the provider
    'clientSecret'            => 'LegacyApplicationFlowDemoClientSecret',   // The client password assigned to you by the provider
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
?>
