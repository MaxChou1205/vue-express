import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

import Index from '../views/Index.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import UserInfo from '../views/UserInfo.vue';
import FundList from '../views/FundList.vue';
import Error404 from '../views/404.vue';

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [
      { path: '', component: Home },
      { path: '/home', name: 'home', component: Home },
      { path: '/userinfo', name: 'userinfo', component: UserInfo },
      { path: '/fundlist', name: 'fundlist', component: FundList },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // if (to.path === '/login' || to.path === '/register') next();
  // else {
  //   const isLogin = localStorage.getItem('x-auth-token') ? true : false;
  //   isLogin ? next() : next('/login');
  // }

  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.getters['auth/isAuthenticated']) {
    next();
  } else {
    next('/login');
  }
});

export default router;
