import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '@/store'

import TakenSurveySection from '@/components/survey/TakenSurveySection.vue'

import HomePage from '@/pages/HomePage.vue'
import AccountPage from '@/pages/AccountPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import WelcomePage from '@/pages/survey/WelcomePage.vue'
import TakenSurveyPage from '@/pages/survey/TakenSurveyPage.vue'
import CompleteSurveyMessagePage from '@/pages/survey/CompleteSurveyMessagePage.vue'
import DpChildSurveyWelcomePage from '@/pages/survey/DpChildSurveyWelcomePage.vue'

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
      path: '/404',
      name: 'notFound',
      component: NotFoundPage
    },
    {
      path: '/:surveyProduct(eq|values|behaviours|discovery-process)/:accessCode([a-zA-Z0-9]{50})',
      name: 'survey.welcome',
      component: WelcomePage,
      props: true
    },
    {
      path: '/:surveyProduct(eq|values|behaviours)/:surveyUserId(\\d+)/part',
      component: TakenSurveyPage,
      props: true,
      children: [
        {
          path: ':sectionNumber(\\d+)',
          name: 'survey.page.part',
          component: TakenSurveySection,
          props: true
        }
      ]
    },
    {
      path: '/discovery-process/:surveyProduct(eq|values|behaviours)/:surveyProductId(\\d+)',
      component: DpChildSurveyWelcomePage,
      props: true,
      name: 'survey.welcome.dp.survey_product'
    },
    {
      path: '/discovery-process/:surveyProduct(eq|values|behaviours)/:surveyUserId(\\d+)/part',
      component: TakenSurveyPage,
      props: true,
      children: [
        {
          path: ':sectionNumber(\\d+)',
          name: 'survey.dp.page.part',
          component: TakenSurveySection,
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
