import req from './https';

export const apiGetProfiles = (params) => {
  return req('get', '/profiles/');
};

export const apiGetProfile = (id) => {
  return req('get', `/profiles/${id}`);
};

export const apiAddProfile = (params) => {
  return req('post', '/profiles/', params);
};

export const apiUpdateProfile = (params) => {
  return req('put', `/profiles/${params.id}`, params);
};

export const apiDeleteProfile = (id) => {
  return req('delete', `/profiles/${id}`);
};
