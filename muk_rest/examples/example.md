# Example

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
					console.log(token);
					
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
