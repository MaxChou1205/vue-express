import { ElMessage, ElLoading } from 'element-plus';
import router from '@/router/index';

import axios from 'axios';
// import { emitter } from '@/utils/mitt';

let loading;
function startLoading() {
  loading = ElLoading.service({
    lock: true,
    text: '讀取中，請稍後',
    background: 'rgba(0,0,0,0.7)',
  });
}

function endLoading() {
  loading.close();
}

/**
 * axios 的實例
 */
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/api'
      : `https:${process.env.VUE_APP_API_URL}api`,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('x-auth-token'),
  },
  crossDomain: true,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    startLoading();
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    endLoading();
    return response;
  },
  (error) => {
    endLoading();
    ElMessage.error(error.response.data);
    const { status } = error.response;
    if (status === 401) {
      ElMessage.error('閒置時間過長，請重新登入');
      localStorage.removeItem('x-auth-token');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

/**
 * 封裝請求
 * @param {*} method
 * @param {*} url
 * @param {*} data
 */
export default function (method, url, data = null) {
  method = method.toLowerCase();
  switch (method) {
    case 'post':
      return instance.post(url, data);
    case 'get':
      return instance.get(url, { params: data });
    case 'delete':
      return instance.delete(url, { params: data });
    case 'put':
      return instance.put(url, data);
    case 'patch':
      return instance.patch(url, data);
    default:
      console.log(`未知的 method: ${method}`);
      return false;
  }
}
