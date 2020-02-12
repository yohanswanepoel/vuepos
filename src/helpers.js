function formatDateForId(date){
    var year = date.getFullYear();
    var month = "" + (date.getMonth() + 1);
    var day = "" + date.getDate();
    if (month.length < 2){
        month = "0" + month;
    }
    if (day.length < 2){
        day = "0" + day;
    }
    return year + "" + month + "" + day;
}

function createDatabaseViews(db, remoteDb){
    var view = {
        _id: '_design/byTypeDesign',
        filters: {
          byTypeFilter: function (doc, req) {
            return doc.type === req.query.type;
          }.toString()
        }
      }
      
      db.get('_design/byTypeDesign').then(function(doc){
        //  
      }).catch(function(err){
        db.put(view);
      });

      remoteDb.get('_design/byTypeDesign').then(function(doc){
        //
      }).catch(function(err){
        remoteDb.put(view);
      });
}

function createSaleViews(db){
    var salesByView = {
        "_id": "_design/salesBy",
        "_rev": "22-1f8dc4b238f6619eae913c5955ddbce9",
        "views": {
          "sum": {
            "reduce": "_sum",
            "map": "function (doc) {\n  if(doc.type == 'sale'){\n    emit([doc.createdAt.slice(0,4), doc.createdAt.slice(5,7), doc.createdAt.slice(8,10)], Number(doc.total));\n  }\n}"
          },
          "count": {
            "reduce": "_count",
            "map": "function (doc) {\n  if(doc.type == 'sale'){\n    emit([doc.createdAt.slice(0,4), doc.createdAt.slice(5,7), doc.createdAt.slice(8,10)], Number(doc.total));\n  }\n}"
          }
        },
        "language": "javascript"
      }
    db.get('_design/salesBy').then(function(doc){
        // The view exists do nothing
    }).catch(function(res){
        db.put(salesByView);
    })
    
}
function addReferenceData(db){

    var groups = [
        {
        "_id": "group:hf",
        "version": 1,
        "name": "Hot Food",
        "type": "group"
    },{
        "_id": "group:sn",
        "name": "Snacks",
        "version": 1,
        "type": "group"
    },{
        "_id": "group:dr",
        "name": "Drinks",
        "version": 1,
        "type": "group"
    },{
        "_id": "group:tr",
        "name": "Treats",
        "version": 1,
        "type": "group"
    },{
        "_id": "group:cf",
        "name": "Cold Foods",
        "version": 1,
        "type": "group"
    },{
        "_id": "group:vp",
        "name": "Value Packs",
        "version": 1,
        "type": "group"
    }];
    db.bulkDocs(
        groups
      ).catch(function(err){
          self.errors.push("Reference Data Insert Failed");
        }
      )
}
export {formatDateForId, addReferenceData, createDatabaseViews, createSaleViews}