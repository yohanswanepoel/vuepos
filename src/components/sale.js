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
          header: "Sale",
          change: 0
       }
	  },
  template: `
    <div>
      <h3>{{ header }}</h3>
      <div class="container">
        <div class="row">
          <div class="col-9">
            <div class="card-columns">
              <div v-for="item in products" class="card" style="width: 16rem;" v-on:click="rowclicked(item.doc)">
                <div class="card-body">
                  <h5 class="card-title">{{ item.doc.group }} - {{ item.doc.shortName }}</h5>
                  <p class="card-text">{{ item.doc.price }} - {{ item.doc.title }}</p>  
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <h6 v-if="sale" class="card-title">Docket - $ {{ sale.total }}</h6>
            <div v-if="sale" class="card overflow-auto"  style="height:200px" >
              <div class="card-body">
                <p class="card-text">
                  <a v-for="ditem in items" v-on:click="removeItem(ditem.productId)" class="list-group-item list-group-item-action litem-js">{{ ditem.quantity }} x {{ ditem.name }} @ {{ ditem.salePrice }}</a>
                </p>
              </div>
            </div>
            <div style="margin-top:5px">
              <button v-if="sale" type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#cashPay">Cash</button>
              <button v-if="sale"   type="button" class="btn btn-warning btn-block" data-toggle="modal" data-target="#cardPay">Card</button>
              <button type="button" class="btn btn-danger btn-block" v-on:click="cancel()">Cancel</button>
            </div>
          </div>
        </div> 
      </div>
      

      <!-- Modal Cash -->
      <div v-if="sale" class="modal fade" id="cashPay" tabindex="-1" role="dialog" aria-labelledby="Cash Payment" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Payment Cash</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="title">Charges $</label>
                <input v-model="sale.total" type="text" class="form-control" id="title" placeholder="Charges" readonly>
              </div>
              <div class="form-group">
                <label for="title">Tender $</label>
                <input v-model="sale.tender" type="number" v-on:change="caculateChange()" class="form-control" id="title" placeholder="Tender">
              </div>
              <div class="form-group">
                <label for="title">Change $</label>
                <input v-model="change" type="text" class="form-control" id="title" placeholder="Change" readonly>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="cashPay()">Complete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Card -->
      <div v-if="sale" class="modal fade" id="cardPay" tabindex="-1" role="dialog" aria-labelledby="Cash Payment" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Card Payment</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="cardPay()">Complete</button>
            </div>
          </div>
        </div>
      </div>

    </div>
    `,
    methods:{
      caculateChange(){
        this.change = parseFloat(this.sale.tender) - this.sale.total;
      },
      cancel(){
        this.items = [],
        this.sale = null
      },
      cashPay(){
        this.items = [],
        this.sale = null
      },
      cardPay(){
        this.items = [],
        this.sale = null
      },
      removeItem(productId){
        var newitem = true;
        for (var i = 0; i < this.items.length; i++){
          if (this.items[i].productId == productId){
            if (this.items[i].quantity > 0){     
               this.items[i].quantity -= 1;
               this.sale.total -= parseFloat(this.items[i].salePrice);
            }
            if (this.items[i].quantity == 0){
              this.items.splice(i, 1);
            }
            break;
          }
        }
      },
      rowclicked(product){
        // This ensures promises do not get messed up
        // Need to add product to docket - needs a docket div
        if (this.sale == null){
          this.sale = {};
          this.sale.total = 0;
        }
        this.sale.total += parseFloat(product.price);
        // see if item exists in list first
        var newitem = true;
        for (var i = 0; i < this.items.length; i++){
          if (this.items[i].productId == product._id){
            this.items[i].quantity += 1;
            newitem = false;
            break;
          }
        }
        if (newitem) {
          var item = {};
          item.discount = product.discount;
          item.productId = product._id;
          item.quantity = 1;
          item.salePrice = product.price;
          item.name = product.shortName;
          this.items.push(item);  
        }
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

  