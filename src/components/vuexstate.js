export default new Vuex.Store({
    state: {
      db: null ,
      user: "test_user",
      user_role: null,
      remoteDB: null,
      loggedIn: false,
    },
    
    getters: {
      // Here we will create a getter
    },
    
    mutations: {
      // Here we will create Jenny
      updateRemoteDB(state, db){
        state.remoteDB = db;
      },
      updateUserInformation(state, user, role, loggedIn){
        state.loggedIn = loggedIn;
        state.user = user;
        state.user_role = role;
      }
    },
    
    actions: {
      // Here we will create Larry
    }
  });