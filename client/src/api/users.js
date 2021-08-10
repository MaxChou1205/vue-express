import req from './https';

export const apiRegister = (params) => {
  return req('post', '/users/register', params);
};

export const apiLogin = (params) => {
  return req('post', '/users/login', params);
};
