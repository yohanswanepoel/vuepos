formatDateForView
import {formatDateForView} from '../helpers.js';

export default {
  name: 'ReportsComponent',
  data() {
		  return { 
          products: [],
          errors: [],
          messages: [],
          summaries: [],
          header: "Reports",
          deleteDoc: null,
          dateFrom: "",
          dateTo: "",
          filterType: "Year"
       }
	  },
  template: `
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky>
            <ul class="nav flex-column>
              <li class="nav-item">Dashboard</li>
            <li class="nav-item">Sales</li>
            <li class="nav-item">Products</li>
            </ul>
          </div>
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div class="table-wrapper">
            <div class="table-title">
              <div class="row">
                <div class="col-sm-6">
                    <h4>{{ header }}</h4>
                </div>
                <div class="col-sm-6">
                  <a class="btn btn-success btn" v-on:click="applyFilter()"><i class="material-icons">&#xE147;</i>Filter</a>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-3">
                    <h5>Sales Today</h5>
                </div>
                <div class="col-sm-3">
                    <h5>Product Sales</h5>
                </div>
                <div class="col-sm-3">
                    <h5>Product Sales</h5>
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
            
          </div>
        </main>
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

      },
      loadSales(fDate, tDate){
        var self = this;
        var db = this.$store.state.remoteDB;
        var querykey_Today = formatDateForView(new Date());
        var from_key = querykey_Today.push["a"];
        var to_key = querykey_Today.push["z"];
        // By year
        db.query('salesBy/sum',{
          reduce: true,
          group_level: 1
        }).then(function(result){
          self.summaries.push({
            name: "Sales Total By Year", rows: result});
        });
        // This Month
        db.query('salesBy/sum',{
          reduce: true,
          group_level: 2
        }).then(function(result){
          self.summaries.push({
            name: "Sales Total By Month", rows: result});
        });
        // Today
        db.query('salesBy/sum',{
          reduce: true,
          group_level: 3
        }).then(function(result){
          self.summaries.push({
            name: "Sales Total By Day", rows: result});
        });
        // Today by Tender
        db.query('salesBy/sum',{
          reduce: true,
          group_level: 4,
          startkey     : from_key,
          endkey       : to_key,
        }).then(function(result){
          self.summaries.push({
            name: "Sales Total Today by Tender", rows: result});
        });
        console.log(self.summaries);
        //startkey: ""+fDate,
        //endkey: ""+tDate+"\ufff0"
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

  