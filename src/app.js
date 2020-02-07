import ProductComponent from './components/product.js';
import ProductViewComponent from './components/listproducts.js';
import POSSaleComponent from './components/sale.js';
import ServerConfig from './components/serverconfig.js';

import store from './components/vuexstate.js'

var db = new PouchDB('swanpos');
//var remoteCouch = 'http://user:pass@myname.example.com/todos';
var remoteDB = 'http://localhost:5984/swanepos';
db.sync(remoteDB, {
  live: true,
  retry: true
}).on('change', function (change) {
  // yo, something changed!
  console.log('changes sync');
}).on('paused', function (info) {
  // replication was paused, usually because of a lost connection
  console.log('paused');
}).on('active', function (info) {
  // replication was resumed
  console.log('resume replication');
}).on('error', function (err) {
  // totally unhandled error (shouldn't happen)
  console.log(err);
});

function sync() {
  syncDom.setAttribute('data-sync-state', 'syncing');
  var opts = {live: true};
  db.replicate.to(remoteCouch, opts, syncError);
  db.replicate.from(remoteCouch, opts, syncError);
}


  const NewSale = { template: '<div>New Sale</div>' }
  const ListSales = { template: '<div>List Sales</div>' }


  const routes = [
    { name: 'newSale', path: '/newSale', component: POSSaleComponent },
    { name: 'listSales', path: '/listSales', component: ListSales },
    { name: 'newProduct', path: '/newProduct', component: ProductComponent, props: { header : 'Create New Product' } },
    { name: 'listProducts', path: '/listProducts', component: ProductViewComponent },
    { name: 'admin', path: '/admin', component: ServerConfig },
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
    },
    methods: {
    },
    created: function () {
        // `this` points to the vm instance
        this.$store.db = db;
        this.$store.router = router;
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


