# Vue Router and components using JS files
See: https://router.vuejs.org/

The Vue router usage in the app is fairly basic. It is used to control 1 level app routing and some query params.

The app uses the router to:
* link in components
* Generate links in HTML5
* Route to end-points in java scripts

## Router Setup
[app.js](../app/app.js)

```javascript
// Import compnent file
import POSSaleComponent from './components/sale.js';

// Setup the routes linking in compnents imported from component files
const routes = [
    ...
    { name: 'newSale', path: '/newSale', component: POSSaleComponent },

    // A route example that uses parameters/properties
    { name: 'newProduct', path: '/newProduct', component: ProductComponent, props: { header : 'Create New Product' } },
    ...
]

// Define router component
const router = new VueRouter({
routes, // short for `routes: routes`
linkActiveClass: "active",
})

// Make router available to Vue App
var app = new Vue({
...
router,
...

```

## Generate links in HTMl 5

In the [index.html](../app/index.html) file you can see examples of how the router-link is used. These generate ```<href>``` components and to field corresponds to the path defined in the router.

```html
<router-link class="nav-item nav-link" to="/newSale">New Sale</router-link>        
```

## Router usage from javascript
In the [app.js](../app/app.js) see the logout method for an example of using routes from the javascript. The push method uses the name defined in the router.

```javascript
this.$router.push({ name: 'login'}).then(function(res){
    // Ignore
    console.log("Logged Out");
})
        
```