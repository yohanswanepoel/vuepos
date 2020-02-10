import ProductComponent from './components/product.js';
import ProductViewComponent from './components/listproducts.js';
import POSSaleComponent from './components/sale.js';
import SaleViewComponent from './components/listsales.js';

import store from './components/vuexstate.js'
import {formatDateForId} from './helpers.js';


var db = new PouchDB('swanpos');
//var remoteCouch = 'http://user:pass@myname.example.com/todos';

  const LoginTemplate = { template: '<div>Logged In</div>' }

  const routes = [
    { name: 'login', path: '/', component: LoginTemplate},
    { name: 'newSale', path: '/newSale', component: POSSaleComponent },
    { name: 'listSales', path: '/listSales', component: SaleViewComponent },
    { name: 'newProduct', path: '/newProduct', component: ProductComponent, props: { header : 'Create New Product' } },
    { name: 'listProducts', path: '/listProducts', component: ProductViewComponent },
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
        sync_handler: null,
        remote_db : null,
        remoteDbstr: ""
    },
    methods: {
      formatDateForId: formatDateForId,
      login:function(){
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
          this.remoteDb = new PouchDB(this.remoteDbstr, {skip_setup: true});
          //
          this.remoteDb.login(this.user, this.password).then(function (res) {
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
            self.database_sync();
          });
        }

      },
      logOut:function(){
        this.user = null;
        this.user_role = null;
        this.loggedIn = false;
        // @TODO Stop sync
        this.sync_handler.cancel();
        this.$router.push({ name: 'login'}).then(function(res){
          // Ignore
          console.log("Logged Out");
        }).catch(function(err){
          // Ignore
        });
        
      },
      database_sync:function (){
        var self = this;
        this.sync_handler = db.sync(this.remoteDbstr, {
          live: true,
          retry: true
        }).on('change', function (change) {
          // yo, something changed!
          var date = new Date();
          var dateStr = date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          self.last_sync = dateStr;
          self.connected = true;
          console.log('changes sync');
        }).on('paused', function (info) {
          //self.connected = true;
          // replication was paused, usually because of a lost connection
          console.log('paused');
          self.connected = true;
        }).on('active', function (info) {
          // replication was resumed
          var date = new Date();
          var dateStr = date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          self.connected = true;
          self.last_sync = dateStr;
          console.log('resume replication');
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
        this.$store.db = db;
        this.$store.router = router;
        this.$store.user_role = null;
        this.$store.connected = true;
        this.$store.today = this.formatDateForId(new Date());
        var debug = true;
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


