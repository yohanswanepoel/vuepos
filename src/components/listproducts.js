import {ProductTemplate} from './datatypes.js';

export default {
  name: 'ProductViewComponent',
  data() {
		  return { 
          products: [],
          errors: [],
          messages: [],
          header: "List Products"
       }
	  },
  template: `
    <div>
      <h3>{{ header }}</h3>
      <table class="table table-striped table-hover  table-sm">
        <thead>
          <tr>
            <th scope="col" colspan="1">Short Name</th>
            <th scope="col" colspan="3">Title</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" v-on:click="rowclicked(item.doc)">
            <td colspan="1">{{ item.doc.shortName }}</td>
            <td colspan="3">{{ item.doc.title }}</td>
            <td>{{ item.doc.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `,
    methods:{
      rowclicked(product){
        // This ensures promises do not get messed up
        //console.log(product.shortName);
        this.$router.push({ name: 'editProduct', params: { id: product._id, heading: 'Edit Product' } })

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
        //console.log(self.products);
        //console.log(self.products[0].doc._id);
      }).catch(function(err){
        console.log(err);
      })
      // Get all the products
    }
};

  