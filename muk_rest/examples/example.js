// Base URL
var url = "https://demo.mukit.at";

// Proxy
var proxy = 'https://cors-anywhere.herokuapp.com/'

// Token
var token;

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

// Life
var life = function(token) {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "GET",
		url: proxy + url + "/api/life",
		data: {
			token: token,
			db: "demo",
		},
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

// Refresh
var refresh = function(token) {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "POST",
		url: proxy + url + "/api/refresh",
		data: {
			token: token,
			db: "demo",
		},
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

// Close
var close = function(token) {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "POST",
		url: proxy + url + "/api/close",
		data: {
			token: token,
			db: "demo",
		},
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

// Search
var search = function(token, model, id, domain, context, count, limit, offset, order) {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "GET",
		url: proxy + url + "/api/search",
		data: {
			token: token,
			db: "demo",
			model: model,
			id: id,
			domain: domain,
			context: context,
			count: count,
			limit: limit,
			offset: offset,
			order: order,
		},
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

// Create
var create = function(token, model, values, context) {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "POST",
		url: proxy + url + "/api/create",
		data: {
			token: token,
			db: "demo",
			model: model,
			values: values,
			context: context,
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

// Delete
var unlink = function(token, model, ids, context) {
	finished = jQuery.Deferred();
	jQuery.ajax({
		dataType: 'json',
		type: "DELETE",
		url: proxy + url + "/api/create",
		data: {
			token: token,
			db: "demo",
			model: model,
			ids: ids,
			context: context,
		},
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
				authenticate().then(function(data) {
					token = data.token;
					
					life(token).done(function() {
						refresh(token).done(function() {
							
							var requests = [];
							
							requests.push(life(token));
							
							requests.push(search(token, "res.users", undefined,
								[['active', '=', 'True']], {'bin_size': 'True'},
								undefined, undefined, undefined, "name asc"));
							
							requests.push(search(token, "res.users", 1, undefined,
								undefined, undefined, undefined, undefined, undefined));
							
							requests.push(search(token, "res.users", undefined, undefined,
								undefined, true, undefined, undefined, undefined));
							
							var cleaned = jQuery.Deferred();
							requests.push(cleaned);
							create(token, "res.partner.category", '{"name": "REST_TAG"}', undefined)
							.then(function(data) {
								if(data) {
									unlink(token, "res.partner.category", data.id)
									.then(function() {
										cleaned.resolve();
									});
								} else {
									cleaned.resolve();
								}
							});
							
							jQuery.when.apply(jQuery, requests).then(function() {
								close(token);
							});
						});
					});

				});
				
			});
			
		} else {
			// jQuery is not loaded
			console.log("Doesn't Work");
		}
		
	};
	document.head.appendChild(e);
})(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js');
