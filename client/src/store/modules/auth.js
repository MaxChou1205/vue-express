import jwt_decode from 'jwt-decode';

const types = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER: 'SET_USER',
};

const state = {
  isAuthenticated: false,
  user: {},
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
};

const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
    if (isAuthenticated) state.isAuthenticated = isAuthenticated;
    else state.isAuthenticated = false;
  },
  [types.SET_USER](state, user) {
    if (user) state.user = user;
    else state.user = {};
  },
};

const actions = {
  setAuthenticated: ({ commit }, isAuthenticated) => {
    commit(types.SET_AUTHENTICATED, isAuthenticated);
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user);
  },
  initLogin: ({ commit }) => {
    const token = localStorage.getItem('x-auth-token');
    if (token) {
      const user = jwt_decode(token);
      commit(types.SET_AUTHENTICATED, true);
      commit(types.SET_USER, user);
    }
  },
  logout: ({ commit }) => {
    localStorage.removeItem('x-auth-token');
    commit(types.SET_AUTHENTICATED, false);
    commit(types.SET_USER, null);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
