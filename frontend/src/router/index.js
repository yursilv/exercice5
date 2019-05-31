import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Announcements from '@/components/main/Announcements';
import Registration from '@/components/Registration';
import Information from '@/components/main/Information';
import Chat from '@/components/main/Chat';
import Profile from '@/components/main/Profile';
import Users from '@/components/main/Users/Users';
import store from '../store';

Vue.use(Router);


// executed to redirect an authenticated user
const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    document.title = to.meta.title;
    next();
    return;
  }
  next('/users');
};

// executed for any page where authentication is needed
const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    document.title = to.meta.title;
    next();
    return;
  }
  next('/');
};

const router = new Router({
  routes: [
    {
      meta: {
        title: 'Добро пожаловать!',
      },
      path: '/',
      name: 'Welcome',
      component: Welcome,
      beforeEnter: ifNotAuthenticated,
    },
    {
      meta: {
        title: 'Объявления',
      },
      path: '/announcements',
      name: 'Announcements',
      component: Announcements,
      beforeEnter: ifAuthenticated,
    },
    {
      meta: {
        title: 'Информация',
      },
      path: '/information',
      name: 'Information',
      component: Information,
      beforeEnter: ifAuthenticated,
    },
    {
      meta: {
        title: 'Чат',
      },
      path: '/chat',
      name: 'Chat',
      component: Chat,
      beforeEnter: ifAuthenticated,
    },
    {
      meta: {
        title: 'Профиль',
      },
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: ifAuthenticated,
    },
    {
      meta: {
        title: 'Пользователи',
      },
      path: '/users',
      name: 'Users',
      component: Users,
      beforeEnter: ifAuthenticated,
    },
    {
      meta: {
        title: 'Регистрация',
      },
      path: '/registration',
      name: 'Registration',
      component: Registration,
      beforeEnter: ifNotAuthenticated,
    },
  ],
});

export default router;
