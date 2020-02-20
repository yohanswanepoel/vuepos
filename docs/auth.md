# Authentication

For this project I used the Couch DB authentication capability. It provided session management all for free. Pouch DB provides a nice method for this as well. It takes care of my database sync and user interaction.

## Why it is sweet!
Couch's AuthSession is HttpOnly cookie and therefore can't be accessed through a client side script. But the cookie itself should be set to a browser by that _session query, so all the consequent requests will be authorized.

## Read more here
* Couch DB Auth documentation: https://docs.couchdb.org/en/2.2.0/config/auth.html
* Pouch/Couch Aut: https://github.com/pouchdb-community/pouchdb-authentication

## In the code
See the login function in [app.js](../app/src/app.js)

```javascript
remoteDbstr = "http://mycouchserver:5984/mycouchdb";
remoteDb = new PouchDB(this.remoteDbstr, {skip_setup: true});
remoteDb.login(this.user, this.password).then(function (res) {
    // successful login
    // Do stuff
    ...
    // save roles ect
    ...
    // start replication and synch ect
    });
}
```
To log out
```javascript
remoteDb.logOut();
```