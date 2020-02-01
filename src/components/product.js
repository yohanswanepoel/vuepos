import {ProductTemplate} from './datatypes.js';

export default {
  name: 'ProductComponent',
  props: ['id', 'header'],
  data() {
		  return { 
          product: ProductTemplate,
          errors: [],
          messages: [],
          newProduct : false,
          updateProduct : true,
       }
	  },
  template: `
    <div>
      <form id="product">
        <h3>{{ header }}</h3>
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
            <option>Hot Food</option>
            <option>Cold Food</option>
            <option>Drinks</option>
            <option>Treats</option>
            <option>Value Packs</option>
            <option>Snacks</option>
          </select>
        </div>
        <div class="form-group">
          <label for="price">Sell Price</label>
          <input v-model="product.price" type="text" class="form-control" id="price" placeholder="0.0">
        </div>
        <div class="form-group">
          <label for="costprice">Cost Price</label>
          <input v-model="product.costPrice" type="text" class="form-control" id="costprice" placeholder="0.0">
        </div>
        <div class="form-group">
          <label for="salestax">Sales Tax</label>
          <input v-model="product.salesTax" type="text" class="form-control" id="salestax" placeholder="0.0">
        </div>
        <div class="form-group">
          <label for="discount">Discount</label>
          <input v-model="product.discount" type="text" class="form-control" id="discount" placeholder="0.0">
        </div>
        <p v-if="errors.length" class="alert alert-danger" role="alert">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
        <p v-if="messages.length" class="alert alert-success" role="alert">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="message in messages">{{ message }}</li>
          </ul>
        </p>
        <button type="button" class="btn btn-primary" v-on:click="saveProduct()">Submit</button>
        <button type="button" class="btn btn-primary" v-on:click="displayDBInfo()">DB Info</button>
        <button type="button" class="btn btn-primary" v-on:click="clearDB()">DB Info</button>
      </form>
    </div>
    `,
    mounted: function () {
        // `this` points to the vm instance
        var db = this.$store.db;
        var self = this;
        var pid = this.$route.params.id;
        this.errors = [];
        this.messages = [];
        if (pid != null){
           // This is an update
            db.get(pid).then(function (doc) {
              console.log(doc);
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
      clearDB(){
        var db = this.$store.db;
        // This ensures promises do not get messed up
        var self = this;
      },
      displayDBInfo() {
        var db = this.$store.db;
        db.info().then(function (info) {
          console.log(info);
        })
        db.get('product:hamburger2').then(function (doc) {
          console.log(doc);
        }).catch(function (err) {
          console.log(err);
        });
      },
      saveProduct(){
        var self = this;
        this.errors = [];
        this.messages = [];
        var db = this.$store.db;
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
        }

        // ID check
        if (this.errors.length == 0 && this.product._id == ""){
          this.product._id = "product:" + this.product.group + ":" + this.product.shortName;
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
              console.log(self.product._id);
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

  