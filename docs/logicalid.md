# Logical IDs
CouchDB logical IDs are awesome. It makes your DB queries super performant as Couch automatically indexes "_id" field.

Use this approach with views as well.

This means you can use the ```allDocs()``` function with a start and end key. This is the preffered way to access documents.

This document explains them really well: https://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html

## Defintion example
See the [product.js](../app/src/components/product.js)

For example create ID based on:
* document type
* date/name or something

```javascript
product._id = "product:" + this.product.group + ":" + this.product.shortName + ":" + id_date;
```

## Query
Use the type as the startKey and then type plus a large unique value as the endKey. 

```javascript
db.allDocs({
    include_docs: true,
    startkey: "product",
    endkey: "product\ufff0"
}).then(function(result){
    self.products = result.rows;
}).catch(function(err){
    console.log(err);
})
```

