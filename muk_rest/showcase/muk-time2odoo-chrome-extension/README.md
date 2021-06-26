# MuK Time2Odoo

This is an example extension for Google Chrome using the MuK Rest API for
tracking work time in the Timesheet / Project module of Odoo.

## Installation

* In Google Chrome go to chrome://extensions/
* Activate the Developer mode on the right upper corner
* Click 'Load unpacked' and choose the 'muk-time2odoo-chrome-extension/src' folder in this repository


## Configuration

* In the MuK Rest API create a new oauth2 configuration (type: authorization code, security: basic access control)
* Right click on the extension in the right upper corner of chrome (the muk logo) and click Manage extensions
* In the odoo oauth2 configuration add a callback url similar to https://adlkxxxjidhnpbbixxxbjeiofgnjxxlk.chromiumapp.org/provider_cb where the string before .chromiumapp is the id of the extension
* On the extension page click Extension options or right click on the Extension Icon and click 'Options'
* Here you can set up the Odoo API url (e.g. https://developers.mukit.at/api), client id and client secret
* On the bottom of the page click the 'Login' button

## Usage

* Click on the MuK Icon
* Click 'Start' when you start your work
* Fill out the project, task and a description before clicking Stop when you are done
* Check the entry in Odoo :)
