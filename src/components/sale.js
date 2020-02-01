import {SaleItemTemplate} from './datatypes.js';
import {SaleTemplate} from './datatypes.js';

/* 
* This is the PoS sale component
* Needs two column Div - products on the left - docket on the right
*/
export default {
  name: 'POSSaleComponent',
  data() {
		  return { 
          products: [],
          sale: null,
          errors: [],
          messages: [],
          items: [],
          header: "Sale"
       }
	  },
  template: `
    <div>
      <h3>{{ header }}</h3>
      <div class="container">
        <div class="row">
          <div class="col-8">
            <table class="table table-striped table-hover  table-sm">
              <thead>
                <tr>
                  <th scope="col">Short Name</th>
                  <th scope="col">Title</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products" class="litem-js" v-on:click="rowclicked(item.doc)">
                  <td>{{ item.doc.shortName }}</td>
                  <td>{{ item.doc.title }}</td>
                  <td>{{ item.doc.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col">
            <p v-if="sale">{{ sale.total }}</p>
            <div class="list-group list-group-flush" name="mylist" role="list">
              <a v-for="ditem in items" href="#" class="list-group-item list-group-item-action litem-js">{{ ditem.name }} - {{ ditem.salePrice }}</a>
            </div>
          </div>
        </div> 
      </div>
    </div>
    `,
    methods:{
      rowclicked(product){
        // This ensures promises do not get messed up
        // Need to add product to docket - needs a docket div
        var item = {};
        if (this.sale == null){
          this.sale = {};
          this.sale.total = 0;
        }
        this.sale.total += parseFloat(product.price);
        item.discount = product.discount;
        item.productId = product._id;
        item.quantity = 1;
        item.salePrice = product.price;
        item.name = product.shortName;
        this.items.push(item);  
      },
    },
    mounted() {
      // This ensures promises do not get messed up
      // All docs is our friend here, using a built-in view, StartKey is the value 
      // and EndKey is the value plus a high value Unicode char
      var self = this;
      var db = this.$store.db;
      db.allDocs({
        include_docs: true,
        startkey: "product",
        endkey: "product\ufff0"
      }).then(function(result){
        self.products = result.rows;
        console.log(self.products);
        console.log(self.products[0].doc._id);
      }).catch(function(err){
        console.log(err);
      })
      // Get all the products
    }
};

  