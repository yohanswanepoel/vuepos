import ProductComponent from './components/product.js';
import ProductViewComponent from './components/listproducts.js';
import POSSaleComponent from './components/sale.js';
import SaleViewComponent from './components/listsales.js';
import ReportsComponent from './components/reports.js';

import store from './components/vuexstate.js'
import {formatDateForId, addReferenceData, createDatabaseViews, createSaleViews} from './helpers.js';


var db = new PouchDB('swanpos');
var remoteDb = null;
//var remoteCouch = 'http://user:pass@myname.example.com/todos';

  const LoginTemplate = { template: '<div>Logged In</div>' }

  const routes = [
    { name: 'login', path: '/', component: LoginTemplate},
    { name: 'newSale', path: '/newSale', component: POSSaleComponent },
    { name: 'listSales', path: '/listSales', component: SaleViewComponent },
    { name: 'newProduct', path: '/newProduct', component: ProductComponent, props: { header : 'Create New Product' } },
    { name: 'listProducts', path: '/listProducts', component: ProductViewComponent },
    { name: 'reports', path: '/reports', component: ReportsComponent},
    { name: 'editProduct', path: '/editProduct/:id', component: ProductComponent, props: { header : 'Update Product' }}
  ]

  const router = new VueRouter({
    routes, // short for `routes: routes`
    linkActiveClass: "active",
  })

var app = new Vue({
    el: '#app',
    store,
    router,
    data: {
        selected: "newsale",
        productList : [],
        sale : [],
        product : {},
        connected : true,
        last_sync : "",
        user : null,
        password: null,
        server: "localhost",
        errors: [],
        messages: [],
        loggedIn: false,
        user_role: null,
        sync_down: null,
        sync_up: null,
        remote_db : null,
        remoteDbstr: ""
    },
    methods: {
      addReferenceData: function(){
        addReferenceData(remoteDb);
      },
      createViews: function(){
        createSaleViews(remoteDb);
        createSaleItemViews(remoteDb);
      },
      formatDateForId: formatDateForId,
      login: function(){
        // validate input
        var self = this;
        console.log("Login");
        if (this.user == ""){
          this.errors.push("Specify user");
        } else if (this.password == ""){
          this.errors.push("Specify password");
        } else if (this.server == "" ){
          this.errors.push("Specify server");
        }
        if (this.errors.length == 0){
          this.remoteDbstr = "http://"+this.server+":5984/swanepos";
          remoteDb = new PouchDB(this.remoteDbstr, {skip_setup: true});
          this.$store.state.remoteDB = remoteDb;
          this.$store.commit('updateRemoteDB',remoteDb);
          //
          remoteDb.login(this.user, this.password).then(function (res) {
            console.log("Login successful");
            console.log(res.roles);
            var x = 0
            for (x = 0; x < res.roles.length; x++){
              if(res.roles[x]=="admin"){
                self.user_role = "admin";
              }else if(res.roles[x]=="pos" && self.user_role != "admin"){
                self.user_role = "pos";
              }
            }
            self.loggedIn = true;
            //@Todo Put this function somewhere else
            self.$store.commit('updateUserInformation',self.user, self.user_role, true);
            self.create_db_views();
            self.database_compact();
            self.database_push();
            self.database_sync();
          });
        }

      },
      logOut: function(){
        this.user = null;
        this.user_role = null;
        this.loggedIn = false;
        // @TODO Stop sync
        this.sync_down.cancel();
        this.$store.commit('updateUserInformation',null, null, false);
        this.$router.push({ name: 'login'}).then(function(res){
          // Ignore
          console.log("Logged Out");
        }).catch(function(err){
          // Ignore
        });
        
      },
      create_db_views: function(){
        createDatabaseViews(db, remoteDb);
      },
      database_push: function(){
        // This is to push the the sales
        var self = this;
        var sale_rep = db.replicate.to(this.remoteDbstr, {
          live: true,
          retry: true,
          filter: 'byTypeDesign/byTypeFilter',
          query_params: {type: 'sale'}
        }).on('paused', function (info) {
          //self.connected = true;
          // replication was paused, usually because of a lost connection
          console.log('paused sale');
        }).on('change', function(change){
          // Changes is replicated up so remove local copy
          var i = 0;
          for (i = 0; i < change.docs.length; i++){
            db.get(change.docs[i]._id).then(function(doc){
              db.remove(doc);
            });
          }
        }).on('error', function (err) {
          // totally unhandled error (shouldn't happen)
          console.log(err);
        });

        var item_rep = db.replicate.to(this.remoteDbstr, {
          live: true,
          retry: true,
          filter: 'byTypeDesign/byTypeFilter',
          query_params: {type: 'saleitem'}
        }).on('paused', function (info) {
          //self.connected = true;
          // replication was paused, usually because of a lost connection
          console.log('paused items');
        }).on('change', function(change){
          console.log(change);
          var i = 0;
          for (i = 0; i < change.docs.length; i++){
            db.get(change.docs[i]._id).then(function(doc){
              db.remove(doc);
            });
          }
          var date = new Date();
          var dateStr = date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          self.last_sync = dateStr;
          self.connected = true;
        }).on('error', function (err) {
          // totally unhandled error (shouldn't happen)
         
          console.log(err);
        });
      },
      database_compact: function(){
        db.compact().then(function (result) {
          // handle result
        }).catch(function (err) {
          console.log(err);
        });
      },
      database_sync: function(){
        // This is for product updates
        var self = this;
        db.sync(this.remoteDbstr, {
          live: true,
          retry: true,
          filter: 'byTypeDesign/byTypeFilter',
          query_params: {type: 'group'}
        });

        this.sync_down = db.sync(this.remoteDbstr, {
          live: true,
          retry: true,
          filter: 'byTypeDesign/byTypeFilter',
          query_params: {type: 'product'}
        }).on('error', function (err) {
          // totally unhandled error (shouldn't happen)
          self.connected = false;
          self.last_sync = "Disconnected";
          console.log(err);
        });
      }
    },
    created: function () {
        // `this` points to the vm instance
        this.$store.state.db = db;
        this.$store.state.user_role = null;
        this.$store.state.connected = true;
        this.$store.state.today = this.formatDateForId(new Date());
        var debug = false;
        if (debug){
          this.user = "posadmin";
          this.user_role = "admin";
          this.loggedIn = true;
        }
    },
    beforeCreate: function(){
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
                .register('./sw.js', {
                  scope : '/'
                });
      }
    }
});


