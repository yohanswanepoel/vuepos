import {SaleItemTemplate, SaleTemplate} from './datatypes.js';

export default {
  name: 'SaleViewComponent',
  data() {
		  return { 
          products: [],
          errors: [],
          messages: [],
          header: "List Sales",
          deleteDoc: null,
          dateFrom: "",
          dateTo: "",
          filterType: "Year"
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
              <a class="btn btn-success btn" v-on:click="applyFilter()"><i class="material-icons">&#xE147;</i>Filter</a>
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
              <th scope="col" colspan="1">Date : 
                <label for="exampleSelect1">Filter Type</label>
                <select v-model="filterType" id="exampleSelect1">
                  <option>Clear</option>
                  <option>Year</option>
                  <option>Month</option>
                  <option>Day</option>
                </select>
              <div v-if="filterType=='Day'">
              From:<input v-model="dateFrom" type="date"  id="activeFrom" placeholder="0.0">
              To:<input v-model="dateTo" type="date"  id="activeFrom" placeholder="0.0">
              </div>
              <div v-if="filterType=='Month' || filterType=='Year'">
              From:<input v-model="dateFrom" type="month"  id="activeFrom" placeholder="0.0">
              To:<input v-model="dateTo" type="month"  id="activeFrom" placeholder="0.0">
              </div>
              </th>
              <th scope="col" colspan="3">Value</th>
              <th scope="col" colspan="1">Tender</th>
              <th scope="col" colspan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products">
              <td colspan="1">{{ item.doc._id | dateFromID }}</td>
              <td colspan="3">{{ item.doc.total }}</td>
              <td colspan="1">{{ item.doc.tender }}</td>
              <td>
                <a href="#" class="edit" v-on:click="rowclicked(item.doc)"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
              </td>
              <td>
                <a href="#deleteItemModal" class="delete" v-on:click="deleteSelected(item.doc)" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Delete Modal HTML -->
      <div id="deleteItemModal" class="modal fade">
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
      rowclicked(item){
        // This ensures promises do not get messed up
        //console.log(product.shortName);
        //this.$router.push({ name: 'editProduct', params: { id: product._id, heading: 'Edit Product' } })

      },
      applyFilter(){
        this.errors = [];
        if (this.filterType == "Clear"){
          this.loadSales("","");
        }else {
          if (this.dateFrom == "" || this.dateTo == ""){
            this.errors.push("Please specify dates");
          } else if (this.filterType == "Year"){
            this.loadSales(this.dateFrom.slice(0,4), this.dateTo.slice(0,4));
          }else if(this.filterType == "Month"){
            var from = this.dateFrom.slice(0,4) + "" + this.dateFrom.slice(5,7);
            var to = this.dateTo.slice(0,4) + "" + this.dateTo.slice(5,7);
            this.loadSales(from, to);
          }else if(this.filterType == "Day"){
            var from = this.dateFrom.slice(0,4) + "" + this.dateFrom.slice(5,7) + "" + this.dateFrom.slice(8,10);
            var to = this.dateTo.slice(0,4) + "" + this.dateTo.slice(5,7) + "" + this.dateTo.slice(8,10);
            this.loadSales(from, to)
          }
        }
      },
      deleteSelected(tiem){
        //this.deleteDoc = item;
      },
      deleteItem(){
        var self = this;
        var db = this.$store.db;
        
        db.get(self.deleteDoc._id).then(function(doc){
          db.remove(doc).then(function(res){
            self.messages.push("Item Deleted");
            self.loadProducts();
            setTimeout(function(){
              self.messages = []; 
             }, 3000);
          }).catch(function(err){
            this.errors.push(err);
          })
        })
      },
      loadSales(fDate, tDate){
        var self = this;
        var db = this.$store.db;
        db.allDocs({
          include_docs: true,
          startkey: "sale:"+fDate,
          endkey: "sale:"+tDate+"\ufff0"
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
      this.loadSales("","")
      // Get all the products
    },
    filters: {
      dateFromID: function(id){
        if (!id) return '';
        var date = id.slice(5,9) + "-" + id.slice(9,11) + "-" + id.slice(11,13);
        var time = id.slice(13,15) + ":" +  id.slice(15,17);
        date = date + " " + time;
        return date;
      }
    }
};

  