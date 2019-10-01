import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '@/store'

import CurrentSurveySection from '@/components/survey/CurrentSurveySection.vue'

import HomePage from '@/pages/HomePage.vue'
import AccountPage from '@/pages/AccountPage.vue'
import WelcomePage from '@/pages/survey/WelcomePage.vue'
import CurrentSurveyPage from '@/pages/survey/CurrentSurveyPage.vue'
import CompleteSurveyMessagePage from '@/pages/survey/CompleteSurveyMessagePage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/:surveyProduct(eq|values|behaviours|discovery-process)/:accessCode([a-zA-Z0-9]{50})',
      name: 'survey.welcome',
      component: WelcomePage,
      props: true
    },
    {
      path: '/:surveyProduct(eq|values|behaviours|discovery-process)/:surveyProductId(\\d)/part',
      name: 'survey.page',
      component: CurrentSurveyPage,
      props: true,
      children: [
        {
          path: ':sectionNumber(\\d+)',
          name: 'survey.page.part',
          component: CurrentSurveySection,
          props: true
        }
      ]
    },
    {
      path: '/complete',
      name: 'survey.complete',
      component: CompleteSurveyMessagePage
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
