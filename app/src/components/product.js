import {ProductTemplate} from './datatypes.js';

export default {
  name: 'ProductComponent',
  props: ['id', 'header'],
  data() {
		  return { 
          product: ProductTemplate,
          errors: [],
          messages: [],
          groups: [],
          newProduct: false,
          updateProduct: true,
       }
	  },
  template: `
    <div>
      <div class="table-wrapper">
        <div class="table-title">
          <div class="row">
            <div class="col-sm-6">
                <h2>{{ header }}</h2>
            </div>
            <div class="col-sm-6">
              <button type="button" class="btn btn-primary "  v-on:click="saveProduct()"><i class="material-icons">save</i>Save</button>
              <button type="button" class="btn btn-success "   v-on:click="createProduct()"><i class="material-icons">&#xE147;</i>New</button>
              <button type="button" class="btn btn-info "   v-on:click="copyProduct()"><i class="material-icons">file_copy</i>Copy</button>
              <button type="button" class="btn btn-warning "   v-on:click="cancel()"><i class="material-icons">backspace</i>Back</button>
            </div>
          </div>
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
        <form id="product">
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label for="shortName">Unique Name</label>
                <input v-if="updateProduct" v-model="product.shortName" type="text" class="form-control" id="shortName" placeholder="Enter unique product name" readonly>
                <input v-if="newProduct" v-model="product.shortName" type="text" class="form-control" id="shortName" placeholder="Enter unique product name">
              </div>
              <div class="form-group">
                <label for="title">Title</label>
                <input v-model="product.title" type="text" class="form-control" id="title" placeholder="Product Title">
              </div>
              <div class="form-group">
                <label for="group">Group</label>
                <select v-model="product.group" class="form-control" id="group">
                  <option v-for="item in groups" v-bind:value="item.doc._id" >{{ item.doc.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="price">Sell Price</label>
                <input v-model="product.price" type="number" class="form-control" id="price" placeholder="0.0">
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label for="costprice">Cost Price</label>
                <input v-model="product.costPrice" type="number" class="form-control" id="costprice" placeholder="0.0">
              </div>
              <div class="form-group">
                <label for="salestax">Sales Tax</label>
                <input v-model="product.salesTax" type="number" class="form-control" id="salestax" placeholder="0.0">
              </div>
              <div class="form-group">
                <label for="discount">Discount</label>
                <input v-model="product.discount" type="number" class="form-control" id="discount" placeholder="0.0">
              </div>
              <div class="form-group">
                <label for="activeFrom">Active From</label>
                <input v-if="updateProduct" v-model="product.activeFrom" type="date" class="form-control" id="activeFrom" readonly placeholder="0.0">
                <input v-if="newProduct" v-model="product.activeFrom" type="date" class="form-control" id="activeFrom" placeholder="0.0">
                          
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    `,
    mounted: function () {
        // `this` points to the vm instance
        var db = this.$store.state.db;
        var self = this;
        var pid = this.$route.params.id;
        this.errors = [];
        this.messages = [];
        // Load group
        db.allDocs({
          include_docs: true,
          startkey: "group:",
          endkey: "group:\ufff0"
        }).then(function(result){
          self.groups = result.rows;
          //console.log(self.products);
          //console.log(self.products[0].doc._id);
        }).catch(function(err){
          console.log(err);
        })
        if (pid != null){
           // This is an update
            db.get(pid).then(function (doc) {
              //console.log(doc);
              self.product = doc;
            }).catch(function (err) {
              self.errors.push(err.status);
              self.errors.push(err.name);
              self.errors.push(err.message);
            });
        }else{
          this.newProduct = true;
          this.updateProduct = false;
        }
        
    },
    methods:{
      createProduct(){
        this.product = ProductTemplate;
        this.newProduct = true;
        this.updateProduct = false;
        this.errors = [];
        this.messages = [];
      },
      copyProduct(){
        var oldProduct = this.product;
        this.product = ProductTemplate;
        this.product._id = "";
        this.product.shortName = oldProduct.shortName;
        this.product.title = oldProduct.title;
        this.product.price = oldProduct.price;
        this.product.costPrice = oldProduct.costPrice;
        this.product.discount = oldProduct.discount;

        this.newProduct = true;
        this.updateProduct = false;
        this.errors = []
        this.messages = []
      },
      cancel(){
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
      },
      saveProduct(){
        var self = this;
        this.errors = [];
        this.messages = [];
        var db = this.$store.state.db;
        var date = new Date();

        // validations
        if (this.product.shortName=="") {
          this.errors.push('Name required.');
        }
        if (this.product.title=="") {
          this.errors.push('Title required.');
        }
        if (this.product.price==0) {
          this.errors.push('Price required.');
        } else {
          this.product.price = parseFloat(this.product.price).toFixed(2)
        }
        if(this.product.activeFrom==""){
          this.errors.push('Active From Date Required.');
        }

        // ID check
        if (this.errors.length == 0 && this.product._id == ""){
          
          var id_date = this.product.activeFrom.replace(/-/g,"");
          this.product._id = "product:" + this.product.group + ":" + this.product.shortName + ":" + id_date;
        }

        if (this.product.createdAt == ""){
          this.product.createdAt = date.toJSON();
        }
        this.product.updatedAt = date.toJSON();
        // Need user update
        if (this.product.createdBy == ""){
          this.product.createdBy = this.$store.user;
        }
        this.product.updatedBy = this.$store.user;

        if (this.errors.length == 0){
          db.put(this.product).then(function (info) {
            self.messages.push( "Successfully saved");
          }).catch(function (err){
            if (err.status == "409"){
              //console.log(self.product._id);
              self.errors.push('The product name already exists');
              self.product._id = "";
            } else {
              self.errors.push(err.status);
              self.errors.push(err.name);
              self.errors.push(err.message);
            }
          });
        }
      }
    }
};

  