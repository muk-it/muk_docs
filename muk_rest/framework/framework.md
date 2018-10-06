# Examples

Here you can find some examples of how you can use the REST API.

## Python

Just like the Javascript code above, the python code can be executed directly in the python shell to test the API.

```python
import json

from odoo import http
from odoo.http import request, Response

from odoo.addons.muk_rest import tools
from odoo.addons.muk_rest.tools.encode import ResponseEncoder		
				
class ModelController(odoo.http.Controller):

	@odoo.http.route([
	    '/api/myapp/myroute'
	], auth="none", type='http', methods=['GET'], csrf=False)
	@tools.common.parse_exception
	@tools.common.ensure_database
	@tools.common.ensure_module()
	@tools.security.protected()
	def myroute(self, **kw):
	    result = ...
	    content = json.dumps(result, sort_keys=True, indent=4, cls=ResponseEncoder)
	    return Response(content, content_type='application/json;charset=utf-8', status=200)
```
