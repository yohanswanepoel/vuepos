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
          header: "Dashboard",
          deleteDoc: null,
          dateFrom: "",
          dateTo: "",
          filterType: "Year",
          chartDataByDay : {},
          xdays: 10
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
          <div class="table-wrapper">
            <div class="table-title">
              <div class="row">
                <div class="col-sm-6">
                    <h4>{{ header }}</h4>
                </div>
              </div>
              <div class="row">
                  <div v-for="summary in summaries" class="card report-summaries">
                    <div class="card-header">
                      {{ summary.name }}
                    </div>
                    <div  class="card-body">
                        <h4>{{ summary.value | currency }}</h4>
                    </div>
                  </div>
                
              </div>
            </div>
            
            <div class="row">
              <div class="card chart-summaries ">
                  <div class="card-header">
                    Sales last {{ xdays }} Days  
                  </div>
                  <div class="card-body">
                      <canvas id="lastxdays"></canvas>
                  </div>
              </div>
            </div> 

          </div> <!-- Table -->
          
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
      summarySalesDaily(fromDate, toDate, db){
        var self = this;
        var from_key = formatDateForView(fromDate);
        var to_key = formatDateForView(toDate);
        from_key.push("a");
        to_key.push("z");
      
        // Today
        db.query('salesBy/sum',{
          startkey: from_key,
          endkey: to_key,
          reduce: true,
          group_level: 3
        }).then(function(result){
          var i = 0;
          for (i = 0; i < result.rows.length; i++){
            self.summaries.push({
              name: "Today Total: "  + result.rows[i].key[0] + "-" + result.rows[i].key[1] + "-" + result.rows[i].key[2] , value: result.rows[i].value});
          }
        });
      },
      summarySalesDailyByTender(fromDate, toDate, db){
        var self = this;
        var from_key = formatDateForView(fromDate);
        var to_key = formatDateForView(toDate);
        from_key.push("a");
        to_key.push("z");
      
        // Today
        db.query('salesBy/sum',{
          startkey: from_key,
          endkey: to_key,
          reduce: true,
          group_level: 4
        }).then(function(result){
          var i = 0;
          for (i = 0; i < result.rows.length; i++){
            self.summaries.push({
              name: "Today by " + result.rows[i].key[3], value: result.rows[i].value});
          }
        });
      },
      summarySalesMonthly(fromDate, toDate, db){
        var self = this;
        var from_key = formatDateForView(fromDate);
        var to_key = formatDateForView(toDate);
        from_key.push("a");
        to_key.push("z");
        from_key[2] = "0";
        to_key[2] = "9";
        // This Month
        db.query('salesBy/sum',{
          startkey: from_key,
          endkey: to_key,
          reduce: true,
          group_level: 2
        }).then(function(result){
          var i = 0;
          for (i = 0; i < result.rows.length; i++){
            self.summaries.push({
              name: "Monthly Total: "  + result.rows[i].key[0] + "-" + result.rows[i].key[1], value: result.rows[i].value});
          }
        });
      },
      summarySalesYearly(fromDate, toDate, db){
        var self = this;
        var from_key = formatDateForView(fromDate);
        var to_key = formatDateForView(toDate);
        from_key.push("a");
        to_key.push("z");
        from_key[2] = "0";
        to_key[2] = "9";
        from_key[1] = "0";
        to_key[1] = "99";
        // By year
        db.query('salesBy/sum',{
          startkey: from_key,
          endkey: to_key,
          reduce: true,
          group_level: 1
        }).then(function(result){
          var i = 0;
          for (i = 0; i < result.rows.length; i++){
            self.summaries.push({
              name: "Yearly Total: " + result.rows[i].key[0], value: result.rows[i].value});
          }
        });
      },
      summarySalesXDays(x){
        var db = this.$store.state.remoteDB;
        var self = this;
        var to_date = new Date();
        var from_date = new Date()
        from_date.setDate(from_date.getDate() - x);
        var from_key = formatDateForView(from_date);
        var to_key = formatDateForView(to_date);
        from_key.push("a");
        to_key.push("z");
        // This Month
        this.chartDataByDay.datasets = [];
        this.chartDataByDay.labels = [];

        db.query('salesBy/sum',{
          startkey: from_key,
          endkey: to_key,
          reduce: true,
          group_level: 3
        }).then(function(result){
          var i = 0;
          self.chartDataByDay.datasets[0] = {data: []};
          for (i = 0; i < result.rows.length; i++){
            self.chartDataByDay.labels.push(result.rows[i].key[2]); 
            self.chartDataByDay.datasets[0].data.push(result.rows[i].value);
          }
          console.log(self.chartDataByDay);
          self.chartsLastXDays();
        });

      },
      loadSales(fDate, tDate){
        var db = this.$store.state.remoteDB;
        var from_date = new Date();
        var to_date = new Date()
        this.summarySalesDaily(from_date, to_date, db);
        this.summarySalesDailyByTender(from_date, to_date, db);
        this.summarySalesMonthly(from_date, to_date, db);
        this.summarySalesYearly(from_date, to_date, db);
      },
      chartsLastXDays(){
        
        var chLine = document.getElementById("lastxdays");
        if (chLine) {
          new Chart(chLine, {
          type: 'line',
          data: this.chartDataByDay,
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false
                }
              }]
            },
            legend: {
              display: false
            }
          }
          });
        }
      },
    },
    mounted() {
      // This ensures promises do not get messed up
      // All docs is our friend here, using a built-in view, StartKey is the value 
      // and EndKey is the value plus a high value Unicode char
      this.loadSales("","");
      
      this.summarySalesXDays(this.xdays);
      // Get all the products
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

  