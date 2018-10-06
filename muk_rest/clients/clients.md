# Clients

Here you can find some examples of how you can use the REST API.

## Javascript

The easiest way to test the API is to open the Chrome Browser and then go to a website like www.google.com. Afterwards you only have to insert and execute the javascript code listed below into the console.

The code will automatically load JQuery and then connect to the REST API. You can then extend the code as you like or call additional ajax calls directly from the console. Examples can be found in [example.js](./example.js).

```javascript
// Base URL
var url = "https://demo.mukit.at";

// Proxy
var proxy = 'https://cors-anywhere.herokuapp.com/'

// Test API
var api = function() {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "GET",
		url: proxy + url + "/api",
		success: function(result) {
			console.log(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.error(textStatus, errorThrown);
		},
		complete: function() {
			finished.resolve();
		}
	});
	return finished;
}

// Authenticate
var authenticate = function() {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "POST",
		url: proxy + url + "/api/authenticate",
		data: {
			db: "demo",
			login: "demo",
			password: "demo",
		},
		success: function(result) {
			console.log(result);
			finished.resolve(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.error(textStatus, errorThrown);
			finished.resolve();
		},
	});
	return finished;
}

// Load jQuery in Chrome console 
javascript: (function(e, s) {
	e.src = s;
	e.onload = function() {
		jQuery.noConflict();
		console.log('jQuery injected');
		
		// Test jQuery is loaded
		if (jQuery) {  
			// jQuery is loaded
			console.log("Loaded!");
			// Test API
			jQuery.when(api()).then(function() {
				authenticate().then(function(token) {
					console.log(token.token);
					
					// Insert your code here!
				});
			});
		} else {
			// jQuery is not loaded
			console.log("Doesn't Work");
		}
		
	};
	document.head.appendChild(e);
})(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js');
```

## Python

Just like the Javascript code above, the python code can be executed directly in the python shell to test the API.

```python
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
```
