import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';
import axios from 'axios';

Vue.use(Vuex);

// application state manager
const store = new Vuex.Store({
  state: {
    user: null, // current user
    token: null, // jwt token
    HTTP: axios.create({
      baseURL: 'http://localhost:1337/api/', // backend rest api url
    }),
  },
  getters: {
    isAuthenticated: state => !!state.token && !!state.user,
  },
  mutations: {
    AUTH_SUCCESS: (state, { token, user }) => {
      state.token = token;
      state.user = user;
    },
    AUTH_LOGOUT: (state) => {
      state.token = null;
      state.user = null;
    },
    TOKEN_UPDATE: (state, token) => {
      state.token = token;
    },
  },
  /*
    the application state is stored in a cookie
    (so when a page is refreshed the user isn't logged out)
  */
  plugins: [
    createPersistedState({
      getState: key => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 1 }),
      // cookies expire in 1 day
    }),
  ],
});

export default store;
