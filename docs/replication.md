# Replication
Replication is relatively straight forward and can be setup to require authentication if user setup is done correctly. 

In this app replication is setup as part of succesful login in [app.js](../app/app.js) in the login function under the vue methods section. 

See the following methods:
```javascript
self.database_push();
self.database_sync();
```

This application uses both options:
* Replicate: this is directional
* Sync: this bi-directional

## Basic replication
See: https://pouchdb.com/guides/replication.html

```javascript
// setup local DB
var localDB = new PouchDB('mylocaldb')
// setup local DB 
var remoteDB = new PouchDB('http://localhost:5984/myremotedb')

localDB.sync(remoteDB).on('complete', function () {
  // yay, we're in sync!
}).on('error', function (err) {
  // boo, we hit an error!
});

```

## Using Filters
Advanced replication. Specifically the application uses filtered replication. This allows me to control which documents are replicated to and from server. For instance, sales are only pushed up to the server and then removed from the client if replication is successful. 

The design document is defined in the createDatabaseViews function in [helpers.js](../app/helpers.js)

Retry is set to true in both instances. The replication will retry itself it disconnects.

## Synchronisation both ways
```javascript
    // Synchronises objects of type product. This requires a design document. byTypeDesign/byTypeFilter
db.sync(this.remoteDbstr, {
    live: true,
    retry: true,
    filter: 'byTypeDesign/byTypeFilter',
    query_params: {type: 'product'}
}).;
```

## Replication sale items from client to server only and then remove them
```javascript

 var sale_rep = db.replicate.to(this.remoteDbstr, {
    live: true,
    retry: true,
    filter: 'byTypeDesign/byTypeFilter',
    query_params: {type: 'sale'}
}).on('change', function(change){
    // Changes is replicated up so remove local copy
    var i = 0;
    for (i = 0; i < change.docs.length; i++){
    db.get(change.docs[i]._id).then(function(doc){
        db.remove(doc);
    });
    }
}).on('error', function (err) {
    // totally unhandled error (shouldn't happen)
    console.log(err);
});
```

