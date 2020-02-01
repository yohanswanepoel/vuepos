// ID convention: type:group:shortname:
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
    "createdAt": "",
    "updatedAt": "",
    "createdBy": "test_user",
    "updatedBy": "test_user"
  };

  // This could be a separate document but it does not change
  // If not it would use some couchdb magic here with generated IDs
  // If this was using couch maging then it would beID defaultSale._id:type:row 
export let SaleItemTemplate = {
      "row": null,
      "productId":null,
      "quantity": null,
      "sale_price":null,
      "discount":null
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
    "itemLIst": [],
    "createdAt": "",
    "updatedAt": "",
    "createdBy": "",
    "updated_by": ""
  };

