import {ProductTemplate} from './datatypes.js';

export default {
  name: 'ProductViewComponent',
  data() {
		  return { 
          products: [],
          errors: [],
          messages: [],
          header: "Products",
          deleteDoc: null
       }
	  },
  template: `
    <div>
      <div class="table-wrapper">
        <div class="table-title">
          <div class="row">
            <div class="col-sm-6">
                <h3>{{ header }}</h3>
            </div>
            <div class="col-sm-6">
              <router-link class="btn btn-success btn" to="/newProduct"><i class="material-icons">&#xE147;</i>New Product</router-link>
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
        <table class="table table-striped table-hover  table-sm">
          <thead>
            <tr>
              <th scope="col" colspan="1">Short Name</th>
              <th scope="col" colspan="3">Title</th>
              <th scope="col" colspan="1">Active Date</th>
              <th scope="col">Price</th>
              <th scope="col" colspan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products">
              <td colspan="1">{{ item.doc.shortName }}</td>
              <td colspan="3">{{ item.doc.title }}</td>
              <td colspan="1">{{ item.doc.activeFrom }}</td>
              <td>{{ item.doc.price }}</td>
              <td>
                <a href="#" class="edit" v-on:click="rowclicked(item.doc)"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
              </td>
              <td>
                <a href="#deleteProductModal" class="delete" v-on:click="deleteSelected(item.doc)" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Delete Modal HTML -->
      <div id="deleteProductModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <form>
              <div class="modal-header">						
                <h4 class="modal-title">Delete Product</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div class="modal-body">					
                <p>Are you sure you want to delete these Records?</p>
                <p class="text-warning"><small>This action cannot be undone.</small></p>
              </div>
              <div class="modal-footer">
                <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                <input type="submit" class="btn btn-danger" data-dismiss="modal" value="Delete" v-on:click="deleteItem()">
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
   
    `,
    methods:{
      rowclicked(product){
        // This ensures promises do not get messed up
        //console.log(product.shortName);
        this.$router.push({ name: 'editProduct', params: { id: product._id, heading: 'Edit Product' } })

      },
      deleteSelected(product){
        this.deleteDoc = product;
      },
      deleteItem(){
        var self = this;
        var db = this.$store.state.db;
        
        db.get(self.deleteDoc._id).then(function(doc){
          db.remove(doc).then(function(res){
            self.messages.push("Product Deleted");
            self.loadProducts();
            setTimeout(function(){
              self.messages = []; 
             }, 3000);
          }).catch(function(err){
            this.errors.push(err);
          })
        })
      },
      loadProducts(){
        var self = this;
        var db = this.$store.state.db;
        console.log(db);
        db.allDocs({
          include_docs: true,
          startkey: "product",
          endkey: "product\ufff0"
        }).then(function(result){
          self.products = result.rows;
          //console.log(self.products);
          //console.log(self.products[0].doc._id);
        }).catch(function(err){
          console.log(err);
        })
      }
    },
    mounted() {
      // This ensures promises do not get messed up
      // All docs is our friend here, using a built-in view, StartKey is the value 
      // and EndKey is the value plus a high value Unicode char
      this.loadProducts()
      // Get all the products
    }
};

  