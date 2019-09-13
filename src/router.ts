import Vue from 'vue'
import Router, { Route } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import TestDragAndDropPage from '@/pages/TestDragAndDropPage.vue'
import TestTapSortingPage from '@/pages/TestTapSortingPage.vue'
import SurveyPage from '@/pages/SurveyPage.vue'
import store from '@/store'
import AccountPage from '@/pages/AccountPage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/survey',
      name: 'survey',
      component: SurveyPage,
      meta: {
        requiresAuth: true
      }
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
      path: '/account',
      name: 'account',
      component: AccountPage,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to: Route, from: Route, next: any) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['user/isAuthenticated']) {
      next()
      return
    }
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
