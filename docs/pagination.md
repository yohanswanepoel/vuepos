# Pagination in Couch DB

Good article: https://docs.couchdb.org/en/latest/ddocs/views/pagination.html

## Slow but super easy method
You can do **skip** and **limit** parameters but that does not use the generated index so is not super performant.

E.g.

```bash
curl -X GET 'http://127.0.0.1:5984/artists/_design/artists/_view/by-name?limit=5&skip=5'
```

## Fast but slightly harder method
Use the **_id** as a StartKey and use **limit**, where limit is results per page + 1. The +1 becomes the starting **_id** for the next page.

The *List Sales* compnent in [listsales.js](../app/src/components/listsales.js) use this approach. See the *loadSales* and *applyFilter* functions.

This pseudo code block describes the process. The example assumes 10 results per page.

### Query
Assuming 10 records per page
* If page key array is empty push the first key
* Query initial result and limit to 11 records
* Store the 11th record as first element in an array
* Keep track of total rows

```javascript
// declare an array to keep track of keys
page_start_keys = []

function query(startHere = ""){
    // query the view/alldocs limit to 10
    // Push the first page
    if (page_start_keys.length == 0){
        page_start_keys.push(fDate);
    }

    db.query('salesBy/sales',{
        limit: 11, // Need 1 more to determine next
        startkey: startHere, // Apply filters if you had some
        endkey: "\ufff0" // Apply filters if you had some
    }).then(function(result){
        // if more records came back than page limit
        if (result.rows.length > 10){
            // put the last record key in the array
            // If record in array exists then update the key 
            // this takes care of changes in the record set
            if (page_start_keys.length >= self.current_page){
              page_start_keys[self.current_page] = result.rows[self.results_per_page].key;
            }else{
            // if the record does not exist append the array
              page_start_keys.push(result.rows[self.results_per_page].key);
            }
            // Remove the last record from display list
            result.rows.pop();
        }
        
        // total_rows variable defaults to 0
        // if it is default
        if (total_rows == 0){
            // Set rows length
            total_rows = result.total_rows;
            // The offset telss you what total size is (useful for keeping track of pages)
            result_total_size = result.total_rows - result.offset;
        }
    });
}

```
### Next and previous page
* Move the pointer in the array forward and back 1 element on the array
 
```javascript
function query(){
    // Move current page back 1
    current_page = current_page - 1;
    loadSales(page_start_keys[current_page - 1])
}

function query(){
    // Move current page forward 1
    current_page++;
    loadSales(page_start_keys[current_page - 1])
},
```
