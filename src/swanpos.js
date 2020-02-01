import ProductComponent from './components/product.js';
import ProductViewComponent from './components/listproducts.js'
import store from './components/vuexstate.js'

var db = new PouchDB('swanpos');




  const NewSale = { template: '<div>New Sale</div>' }
  const ListSales = { template: '<div>List Sales</div>' }


  const routes = [
    { name: 'newSale', path: '/newSale', component: NewSale },
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
    },
    methods: {
    },
    created: function () {
        // `this` points to the vm instance
        this.$store.db = db;
        this.$store.router = router;
    }
})