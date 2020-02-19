# Vue Components
The components allowed me to seperate different functions into their own self contained files.

External links:
* 7 Ways to create Vue Components, excellent blog: https://vuejsdevelopers.com/2017/03/24/vue-js-component-templates/
* Vue Documentation: https://vuejs.org/v2/guide/components.html
* The nice way: https://vuejs.org/v2/guide/single-file-components.html

Calling and usage see [Router Documentation](vuerouter.md)

Using webpacks and .vue files may be better, but I used string literals.

The compnents are in the [components](../app/src/components) folder

## Template Literal Approach
Example from product compnent see [product.js](../app/src/components/product.js)

```javascript
export default {
  name: 'ProductComponent',
  props: ['id', 'header'],
  data() {
      ...
  },
  template: `<div>...
              ...
              </div>`
  mounted: function(){
      //component is ready do something
  },
  methods:
  ... declare methods here

});
```
## Import and use in router Component
See [app.js](../app/src/app.js)

Import the component
```javascript
import ProductComponent from './components/product.js';
```

Use the component in the router
```javascript
{ name: 'newProduct', path: '/newProduct', component: ProductComponent, props: { header : 'Create New Product' } },
    
```
