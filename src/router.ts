import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import TestDragAndDropPage from '@/pages/TestDragAndDropPage.vue'
import TestTapSortingPage from '@/pages/TestTapSortingPage.vue'
import SortingPage from '@/pages/SortingPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/sorting',
      name: 'test_sorting',
      component: SortingPage
    },
    {
      path: '/drag',
      name: 'test_drag',
      component: TestDragAndDropPage
    },
    {
      path: '/tap',
      name: 'test_tap',
      component: TestTapSortingPage
    },
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: SignUpPage
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: SignInPage
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/pages/AboutPage.vue')
    }
  ]
})
