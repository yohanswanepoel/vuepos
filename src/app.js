import ProductComponent from './components/product.js';
import ProductViewComponent from './components/listproducts.js';
import POSSaleComponent from './components/sale.js';

import store from './components/vuexstate.js'

var db = new PouchDB('swanpos');
//var remoteCouch = 'http://user:pass@myname.example.com/todos';
var remoteDB = 'http://localhost:5984/swanepos';

  const NewSale = { template: '<div>New Sale</div>' }
  const ListSales = { template: '<div>List Sales</div>' }

  const LoginTemplate = { template: '<div>Logged In</div>' }

  const routes = [
    { name: 'login', path: '/', component: LoginTemplate},
    { name: 'newSale', path: '/newSale', component: POSSaleComponent },
    { name: 'listSales', path: '/listSales', component: ListSales },
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
        sync_handler: null
    },
    methods: {
      login:function(){
        // validate input
        console.log("Login");
        if (this.user == ""){
          this.errors.push("Specify user");
        } else if (this.password == ""){
          this.errors.push("Specify password");
        } else if (this.server == "" ){
          this.errors.push("Specify server");
        }
        if (this.errors.length == 0){
          if (this.user == "j"){
            this.user_role = "admin";
          }else{
            this.user_role = "pos";
            this.$router.push({ name: 'newSale'})
          }
          this.loggedIn = true;
          this.database_sync();
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
        var remoteDb = "http://"+this.server+":5984/swanepos";
        var self = this;
        this.sync_handler = db.sync(remoteDb, {
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


