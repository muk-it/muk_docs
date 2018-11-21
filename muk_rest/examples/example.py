import json
import requests

from pprint import pprint

from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import BackendApplicationClient

class RestAPI:
    def __init__(self):
        self.url = '<server_url>'
        self.client_id = '<client_id>'
        self.client_secret = '<client_secret>'
        self.client = BackendApplicationClient(client_id=self.client_id)
        self.oauth = OAuth2Session(client=self.client)

    def route(self, url):
        if url.startswith('/'):
            url = "%s%s" % (self.url, url)
        return url

    def authenticate(self):
        self.oauth.fetch_token(
            token_url=self.route('/api/authentication/oauth2/token'),
            client_id=self.client_id, client_secret=self.client_secret
        )

    def execute(self, enpoint, type="GET", data={}):
        if type == "POST":
            response = self.oauth.post(self.route(enpoint), data=data)
        elif type == "PUT":
            response = self.oauth.put(self.route(enpoint), data=data)
        elif type == "DELETE":
            response = self.oauth.delete(self.route(enpoint), data=data)
        else:
            response = self.oauth.get(self.route(enpoint), data=data)
        if response.status_code != 200:
            raise Exception(pprint(response.json()))
        else:
            return response.json()

# init API
api = RestAPI()
api.authenticate()

# test API
pprint(api.execute('/api'))
pprint(api.execute('/api/user'))

# check customer
data = {
    'model': "res.partner",
    'domain': json.dumps([['name', '=', "Sample Customer"]]),
    'limit': 1
}
response = api.execute('/api/search', data=data)
customer = next(iter(response), False)

# create customer
if not customer:
    values = {
        'name': "Sample Customer",
    }
    data = {
        'model': "res.partner",
        'values': json.dumps(values),
    }
    response = api.execute('/api/create', type="POST", data=data)
    customer = next(iter(response))

# create product
values = {
    'name': "Sample Product",
}
data = {
    'model': "product.template",
    'values': json.dumps(values),
}
response = api.execute('/api/create', type="POST", data=data)
product = next(iter(response))

# create order
values = {
    'partner_id': customer,
    'state': 'sale',
    'order_line': [(0, 0, {'product_id': product})],
}
data = {
    'model': "sale.order",
    'values': json.dumps(values),
}
response = api.execute('/api/create', type="POST", data=data)
order = next(iter(response))
