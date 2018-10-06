# REST API Framework

Here you can find some examples of how you can extend the REST API.

It is important to note that if the API is extended in a new module, it must also be added to the global modules
if there is more than one database and therefore none can be selected automatically.

To activate the routes even if no database is selected the module should be loaded right at the server start. This
can be done by editing the configuration file or passing a load parameter to the start script.

Parameter: `--load=web,muk_rest`

## Adding new routes to the API

Adding a new enpoint is relatively simple. Here is an example which adds a new route to the API.

```python
import json

from odoo import http
from odoo.http import request, Response

from odoo.addons.muk_rest import tools
from odoo.addons.muk_rest.tools.encode import ResponseEncoder        
                
class MyController(odoo.http.Controller):

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

## Changing routes in the API

As well as any other class in Python the desired method can be easily overwritten.

```python
import json

from odoo import http
from odoo.http import request, Response

from odoo.addons.muk_rest import tools
from odoo.addons.muk_rest.tools.encode import ResponseEncoder        
                
class ExtendMyController(MyController):

    @odoo.http.route([
        '/api/myapp/myroute'
    ], auth="none", type='http', methods=['GET'], csrf=False)
    @tools.common.parse_exception
    @tools.common.ensure_database
    @tools.common.ensure_module()
    @tools.security.protected()
    def myroute(self, **kw):
        response = super(ExtendMyController, self).myroute(kw)
        ...
        return response
```

## Helper

Take a look now at the available helper and decorators.

### Decorator - parse_exception

```python
from odoo.addons.muk_rest import tools

@tools.common.parse_exception
def method(self, **kw):
	...
```

This decorator ensures that exceptions that occur during the execution of the method are
parsed into a json response and a corresponding response is returned to the API client.

### Decorator - ensure_database

```python
from odoo.addons.muk_rest import tools

@tools.common.ensure_database
def method(self, **kw):
	...
```

This decorator can be used to ensure that the method is only executed when a database is selected.

### Decorator - ensure_module

```python
from odoo.addons.muk_rest import tools

@tools.common.ensure_module(module='muk_rest', error=_("The Restful API is not supported by this database."))
def method(self, **kw):
	...
```

This decorator can be used to ensure that a module is installed before executing the method.

### Decorator - protected

```python
from odoo.addons.muk_rest import tools

@tools.common.protected(operations=['read'], check_custom_routes=False)
def method(self, **kw):
	...
```

This decorator ensures that the corresponding method is allowed on the API client.

### Helper - ResponseEncoder

Json Encoder, which handles the seralization during the dump creation.

### Helper - RecordEncoder

Json Encoder, which handles the seralization during the dump creation and allows the duming of recrods. 