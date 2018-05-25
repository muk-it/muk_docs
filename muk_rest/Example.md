# Example

```javascript
// Load jQuery in Chrome console 
javascript: (function(e, s) {
    e.src = s;
    e.onload = function() {
        jQuery.noConflict();
        console.log('jQuery injected');
    };
    document.head.appendChild(e);
})(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js');

// Test jQuery is loaded
jQuery(document).ready(function(){
	if (jQuery) {  
		// jQuery is loaded
		console.log("Loaded!");
	} else {
		// jQuery is not loaded
		console.log("Doesn't Work");
	}
});
```
