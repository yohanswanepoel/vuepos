import {SaleItemTemplate, SaleTemplate} from './datatypes.js';

export default {
  name: 'SaleViewComponent',
  data() {
		  return { 
          sales: [],
          errors: [],
          messages: [],
          header: "Sales",
          deleteDoc: null,
          dateFrom: "",
          dateTo: "",
          filterType: "Clear",
          total_rows: 0,
          result_total_size: 0, // total_rows - offset,
          results_per_page: 15,
          current_page: 1,
          to_date: "",
          has_more_pages: false,
          page_start_keys: []
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
              <a class="btn btn-primary" v-on:click="applyFilter()"><i class="material-icons">filter_list</i>Filter</a>
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
              <th scope="col" colspan="1">
                <div class="col-sm">
                  
                </div>
              </th>
              <th scope="col" colspan="3">Value</th>
              <th scope="col" colspan="1">Tender</th>
              <th scope="col" colspan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sales">
              <td colspan="1">{{ item.key | dateFromID }}</td>
              <td colspan="3">{{ item.value.total | currency }}</td>
              <td colspan="1">{{ item.value.tender }}</td>
              <td>
                <a href="#" class="edit" v-on:click="rowclicked(item.doc)"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
              </td>
              <td>
                <a href="#deleteItemModal" class="delete" v-on:click="deleteSelected(item.doc)" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-title">
          <div class="row">
              <div class="col-sm-4">
                <a v-if="showPreviousPage()" class="btn btn-secondary" v-on:click="previousPage()"><i class="material-icons">navigate_before</i>Previous Page</a>
              </div>
              <div class="col-sm-3">
                {{ pageCount }}
                <a v-if="showNextPage()" class="btn btn-secondary" v-on:click="nextPage()"><i class="material-icons">navigate_next</i>Next Page</a>
              </div>
          </div>
        </div>
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
        this.page_start_keys = [];
        this.current_page = 1;
        this.result_total_size = 0;
        this.total_rows = 0;
        if (this.filterType == "Clear"){
          this.to_date = "";
          this.loadSales("","");
        }else {
          if (this.dateFrom == "" || this.dateTo == ""){
            this.errors.push("Please specify dates");
          } else if (this.filterType == "Year"){
            this.loadSales("sale:" + this.dateFrom.slice(0,4), "sale:" + this.dateTo.slice(0,4));
          }else if(this.filterType == "Month"){
            var from = "sale:" + this.dateFrom.slice(0,4) + "" + this.dateFrom.slice(5,7);
            var to = "sale:" + this.dateTo.slice(0,4) + "" + this.dateTo.slice(5,7);
            this.to_date = to;
            this.loadSales(from, to);
          }else if(this.filterType == "Day"){
            var from = "sale:" + this.dateFrom.slice(0,4) + "" + this.dateFrom.slice(5,7) + "" + this.dateFrom.slice(8,10);
            var to = "sale:" + this.dateTo.slice(0,4) + "" + this.dateTo.slice(5,7) + "" + this.dateTo.slice(8,10);
            this.to_date = to;
            this.loadSales(from, to)
          }
        }
      },
      showPreviousPage(){
        return this.current_page != 1;
      },
      showNextPage(){
        return this.current_page != Math.ceil(this.result_total_size / this.results_per_page)
      },
      previousPage(){
        this.current_page = this.current_page - 1;
        this.loadSales(this.page_start_keys[this.current_page - 1],this.to_date)
      },
      nextPage(){
        this.current_page++;
        this.loadSales(this.page_start_keys[this.current_page - 1],this.to_date)
      },
      deleteSelected(tiem){
        //this.deleteDoc = item;
      },
      deleteItem(){
        var self = this;
        var db = this.$store.state.remoteDB;
        
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
        var db = this.$store.state.remoteDB;
        if (this.page_start_keys.length == 0){
          this.page_start_keys.push(fDate);
        }
        db.query('salesBy/sales',{
          limit: self.results_per_page + 1, //Need 1 more to determine next startKey
          startkey: ""+fDate,
          endkey: ""+tDate+"\ufff0"
        }).then(function(result){
          if (result.rows.length > self.results_per_page){
            self.page_start_keys.push(result.rows[self.results_per_page].key);
            result.rows.pop();
          }
          self.sales = result.rows;
          if (self.total_rows == 0){
            self.total_rows = result.total_rows;
            self.result_total_size = result.total_rows - result.offset;
          }
        });
      }
    },
    mounted() {
      // This ensures promises do not get messed up
      // All docs is our friend here, using a built-in view, StartKey is the value 
      // and EndKey is the value plus a high value Unicode char
      this.loadSales("","")
      // Get all the products
    },
    computed: {
      pageCount: function(){
        var message = "Records: ";
        message += this.result_total_size
        message = message + " | " + this.current_page;
        message = message + " of " + Math.ceil(this.result_total_size / this.results_per_page)
        return message;
      }
    },
    filters: {
      dateFromID: function(id){
        if (!id) return '';
        var date = id.slice(5,9) + "-" + id.slice(9,11) + "-" + id.slice(11,13);
        var time = id.slice(13,15) + ":" +  id.slice(15,17);
        date = date + " " + time;
        return date;
      },
      currency: function(value){
        return "$ " + value;
      }
    }
};

  