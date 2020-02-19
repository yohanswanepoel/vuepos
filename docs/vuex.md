# Session Management Vuex
The vuex documentation is good and it is pretty straight forward.

See: https://vuex.vuejs.org

The only trick is updating values. That is done using mutations.

see [vuexstate.js](../apps/src/components/vuexstate.js)

## Sample mutation function
```javascript
...
 mutations: {
        updateRemoteDB(state, db){
        state.remoteDB = db;
    },
...
```

## Updating a value
Use the commit function on the vuex store link to the function in the commit. See the updateRemoteDB 

```javascript
...
this.$store.commit('updateRemoteDB',remoteDb);
...
```