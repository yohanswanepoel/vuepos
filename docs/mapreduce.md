# Map Reduce and Views

Views provide a way to extract, order and present data in a specific way. 

Views use Map and optionally Reduce Jobs
* Map: You can use a Map Job, to create a set of key, value pairs (composite of required) of the data. 
* Reduce: Allows you to summarise the Map data using different levels.

[Official Documentation](https://docs.couchdb.org/en/stable/ddocs/views/intro.html)


## Why it is sweet!
This makes it easy to represent data in different ways and keeps the logic on the database side. In PouchDB you could do this in memory on the client side, on the server side it provides optimisations.

## Read more here
* [More good Doco](http://guide.couchdb.org/draft/views.html)
* [A Recipe for creating views](https://www.lullabot.com/articles/a-recipe-for-creating-couchdb-views)

## In the code
Sample code
* Create view functions in [helpers.js](../app/src/helpers.js)
* Using views see [reports.js](../app/src/components/reports.js)

``` javascript
db.query('salesBy/sum',{
    startkey: from_key,
    endkey: to_key,
    reduce: true,
    group_level: 4
}).then(function(result){
    var i = 0;
    for (i = 0; i < result.rows.length; i++){
    self.summaries.push({
        name: "Today by " + result.rows[i].key[3], value: result.rows[i].value});
    }
});
```


The views include examples of composite keys and composite value columns.
* Composite keys doing using arrays allow for data to be grouped/summed ect at different levels of the composite key. This was used extensively in the reports and dashboards of the app.

