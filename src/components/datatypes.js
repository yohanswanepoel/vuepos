// ID convention: type:group:shortname
export let ProductTemplate = {
    "_id": "",
    "type": "product",
    "version": 1,
    "shortName": "",
    "title": "",
    "group": "Hot Food",
    "price": 0,
    "costPrice": 0,
    "discount": 0,
    "salesTax": 0,
    "activeFrom": "",
    "createdAt": "",
    "updatedAt": "",
    "createdBy": "test_user",
    "updatedBy": "test_user"
  };

  // This could be a separate document but it does not change
  // If not it would use some couchdb magic here with generated IDs
  // If this was using couch maging then it would be: ID item:sale._id:productId 
export let SaleItemTemplate = {
      "_id": null,
      "productId":null,
      "name":"",
      "quantity": null,
      "salePrice":null,
      "discount":null,
      "createdAt": "",
      "updatedAt": "",
      "createdBy": "",
      "updated_by": ""
  };

  // ID convention: type:yearmonthdayhourminutesecond:total:tender
  // Tender - cash/card
export let SaleTemplate = {
    "_id": "",
    "type": "sale",
    "version": 1,
    "total": null,
    "tender": null,
    "discount": null,
    "salesTaxTotal": null,
    "tender":"",
    "createdAt": "",
    "updatedAt": "",
    "createdBy": "",
    "updated_by": ""
  };

// ID terminal type:number:yearmonthdayhour
export let ServerConfig = {
    "_id": "",
    "url": "sale",
    "user": "",
    "password": "",
    "createdAt": "",
    "updatedAt": "",
    "createdBy": "",
    "updated_by": ""
  };

