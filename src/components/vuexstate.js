export default new Vuex.Store({
    state: {
      db: null ,
      user: "test_user",
      user_role: null,
      remoteDB: null
    },
    
    getters: {
      // Here we will create a getter
    },
    
    mutations: {
      // Here we will create Jenny
      updateRemoteDB(state, db){
        state.remoteDB = db;
      }
    },
    
    actions: {
      // Here we will create Larry
    }
  });