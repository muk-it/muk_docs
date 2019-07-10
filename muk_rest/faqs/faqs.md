# FAQs

This documentation is intended to provide an easy introduction to working with the REST API
by answering some frequently asked questions.

## Why do the endpoints return a 404 page?

This probably occurs because there are multiple databases on the system and the database
filter is not set to automatically select one.

To activate the routes even if no database is selected the module should be loaded right
at the server start. This can be done by editing the configuration file or passing a load
parameter to the start script.

Parameter: `--load=web,muk_rest`

Now the corresponding database can be selected by specifying an additional parameter.

Parameter: `?db=database`

As long as the same session is used, the correct database is automatically selected.

So before the OAuth authorization check for the database by sending `/api/database?db=mydatabasename`to the server.

## Why do I get the an error with the code: insecure_transport_protocol?

By default, the API does not allow access over an insecure connection.

It is possible to set the environment variable `OAUTHLIB_INSECURE_TRANSPORT` on your system.

## What is the best way to load file or image data?

That depends: If they are public I would lazy load them with an URL. Otherwise it might be
easier to load them before. The REST API always returns data as base64 but you can use the
web route: `web/content`
