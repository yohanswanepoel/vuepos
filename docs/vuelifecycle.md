# Vue Lifecycle
Vue instances have a lifecycle. This allows you to do things such as loading data as required.

[Offical Doco](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)

## Sample usage
Usage in the code example [app.js](../app/app.js).
* Created is used to setup some state in the Vuex store.
* Before create is used to setup the service workers for the Progressive Web App

```javascript

created: function () {
    // `this` points to the vm instance
    this.$store.state.db = db;
    this.$store.state.user_role = null;
    ...
},
beforeCreate: function(){
    if ('serviceWorker' in navigator) {
    navigator.serviceWorker
            .register('./sw.js', {
                scope : '/'
            });
    }
}

```

The mounted method is also used as a place to load initial data.
