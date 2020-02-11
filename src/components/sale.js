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
          change: -1,
          today: ""
       }
	  },
  template: `
    <div>
      <h3>{{ header }}</h3>
      <div class="container">
        <div class="row">
          <div class="col-9 overflow-auto"  style="height:100%">
            <div id="accordion">
              <div v-for="productgroup, index in groupedProducts" class="card">
                <div class="card-header bg-secondary" id="headingOne" data-toggle="collapse" :data-target="'#prod' + index" >
                  <h5 class="mb-0">
                    <button class="btn text-white"  aria-expanded="true" aria-controls="collapseOne">
                      {{ productgroup.group }}
                    </button>
                  </h5>
                </div>

                <div :id="'prod' + index" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                  <div class="card-body">
                    <div class="card-columns">
                      <div v-for="item in productgroup.items" class="card" style="width: 15rem;" v-on:click="rowclicked(item)">
                        <div class="card-body">
                          <h5 class="card-title">{{ item.title }}</h5>
                          <p class="card-text">$ {{ item.price }}</p>  
                        </div>
                      </div>
                    </div>
                  </div>
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
            <p v-if="errors.length" class="alert alert-danger" role="alert">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors">{{ error }}</li>
              </ul>
            </p>
            <p v-if="messages.length" class="alert alert-success" role="alert">
              <ul>
                <li v-for="message in messages">{{ message }}</li>
              </ul>
            </p>
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
                <input v-model="sale.total" type="number" class="form-control" id="title" placeholder="Charges" readonly>
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
              <button v-if="change >= 0" type="button" class="btn btn-success" data-dismiss="modal" v-on:click="cashPay()">Complete</button>
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
              <div class="form-group">
                <label for="title">Charges $</label>
                <input v-model="sale.total" type="number" class="form-control" id="title2" placeholder="Charges" readonly>
              </div>
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
      generatedSaleId(date){
          // ID convention: type:yearmonthdayhourminutesecond:total:tender
          var hours = "" + date.getHours();
          var minutes =  "" + date.getMinutes();
          var seconds = "" + date.getSeconds();
          if (hours.length < 2) {
            hours = "0" + hours;
          }
          if (minutes.length < 2) {
            minutes = "0" + minutes;
          }
          if (seconds.length < 2) {
            seconds = "0" + seconds;
          }
          var time = hours + minutes + seconds
          var dateStr = this.$store.state.today + "" + time;
          return "sale" + ":" + dateStr + ":" + this.sale.total; 
      },
      createSaleItem(tenderType){
        var db = this.$store.state.db;
        var date = new Date();
        this.sale._id = this.generatedSaleId(date);
        this.sale.tender = tenderType
        this.sale.createdBy = this.$store.user;
        this.sale.createdAt = date;
        this.sale.type = 'sale';
        let i = 0;
        for (i = 0; i < this.items.length; i++){
          this.items[i]._id = "item:"+this.sale._id + ":" + this.items[i].productId;
          
        }
        // Add the Sale document to the items array for a bulk insert
        var insertDocs = this.items.concat(this.sale);
        var self = this;
        db.bulkDocs(
          insertDocs
        ).then(function(result){
            self.items = [];
            self.sale = null;
            self.messages.push("Successfully Updated");
            setTimeout(function(){
               self.messages = []; 
              }, 3000);
          }
        ).catch(function(err){
            self.errors.push("Save Failed");
          }
        )
        //item:sale._id:productId


        
      },
      caculateChange(){
        this.change = parseFloat(this.sale.tender) - this.sale.total;
        this.change = this.change.toFixed(2);
      },
      cancel(){
        this.items = [];
        this.sale = null;
      },
      cashPay(){
        this.createSaleItem("cash");
      },
      cardPay(){
        this.sale.tender = this.sale.total;
        this.createSaleItem("eftpos")
      },
      removeItem(productId){
        for (var i = 0; i < this.items.length; i++){
          if (this.items[i].productId == productId){
            if (this.items[i].quantity > 0){     
               this.items[i].quantity -= 1;
               this.sale.total -= parseFloat(this.items[i].salePrice);
               this.sale.total = this.sale.total.toFixed(2);
            }
            if (this.items[i].quantity == 0){
              this.items.splice(i, 1);
            }
            break;
          }
        }
        if (this.items.length == 0){
          this.sale = null;
        }
      },
      rowclicked(product){
        // This ensures promises do not get messed up
        // Need to add product to docket - needs a docket div
        if (this.sale == null){
          this.sale = {};
          this.sale.total = 0;
        }
        var total = parseFloat(this.sale.total);
        total += parseFloat(product.price);
        this.sale.total = parseFloat(total).toFixed(2);
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
          item.salePrice = parseFloat(product.price).toFixed(2);
          item.name = product.shortName;
          item.type = 'saleitem';
          var date = new Date()
          item.createdAt = date.toJSON();
          item.createdBy = this.$store.user;
          this.items.push(item);  
        }
      },
    },
    mounted() {
      // This ensures promises do not get messed up
      // All docs is our friend here, using a built-in view, StartKey is the value 
      // and EndKey is the value plus a high value Unicode char
      var self = this;
      var db = this.$store.state.db;
      var today = this.$store.today;

      console.log(today)
      db.allDocs({
        include_docs: true,
        descending: true,
        endkey: "product",
        startkey: "product:\ufff0"
      }).then(function(result){
        self.products = result.rows;
        //console.log(self.products);
        //console.log(self.products[0].doc._id);
      }).catch(function(err){
        console.log(err);
      })
      
      // Get all the products
    },
    computed: {
      groupedProducts(){
        var self = this;
        var groupedProducts = []
        var i = 0;
        var j = -1;
        var group = "";
        var prev_prod = "";
        //console.log("Computed");
        //console.log(self.products.length)
        var today = new Date();
        var active_from = new Date();
        for (i = 0; i < self.products.length; i++){
          // New group 
          //console.log(self.products[i].doc._id);
          active_from = new Date(self.products[i].doc.activeFrom);
          if (active_from <= today){
            if (self.products[i].doc.group != group){
              j++
              group = self.products[i].doc.group;
              groupedProducts[j] = {group: group, items: []};
              //console.log(group);
              prev_prod = "";
            }
            if (self.products[i].doc.shortName != prev_prod){
              prev_prod = self.products[i].doc.shortName;
              groupedProducts[j].items.push(self.products[i].doc);
            }
          }
        }
        return groupedProducts;
      }
    }
};

  