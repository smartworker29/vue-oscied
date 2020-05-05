import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '@/store'

import TakenSurveySection from '@/components/survey/TakenSurveySection.vue'
import IcoachSkillSection from '@/components/icoach/IcoachSkillSection.vue'

import HomePage from '@/pages/HomePage.vue'
import AccountPage from '@/pages/AccountPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import WelcomePage from '@/pages/survey/WelcomePage.vue'
import IcoachWelcomePage from '@/pages/icoach/WelcomePage.vue'
import IcoachDashboardPage from '@/pages/icoach/DashboardPage.vue'
import IcoachSkillPage from '@/pages/icoach/IcoachSkillPage.vue'
import TakenSurveyPage from '@/pages/survey/TakenSurveyPage.vue'
import CompleteSurveyMessagePage from '@/pages/survey/CompleteSurveyMessagePage.vue'
import DpChildSurveyWelcomePage from '@/pages/survey/DpChildSurveyWelcomePage.vue'
import DpChildSurveyCompletedPage from '@/pages/survey/DpChildSurveyCompletedPage.vue'

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
      path: '/icoach/:accessCode([a-zA-Z0-9]{50})',
      name: 'icoach.welcome',
      component: IcoachWelcomePage,
      props: true
    },
    {
      path: '/icoach/:icoachUserId(\\d+)/dashboard',
      name: 'icoach.dashboard',
      component: IcoachDashboardPage,
      props: true
    },
    {
      path: '/icoach/:icoachUserId(\\d+)/skill/:skillId(\\d+)/step',
      component: IcoachSkillPage,
      props: true,
      children: [
        {
          path: ':stepId(\\d+)',
          name: 'icoach.skill',
          component: IcoachSkillSection,
          props: true
        }
      ]
    },
    {
      path: '/icoach/complete',
      name: 'icoach.skill.complete',
      component: CompleteSurveyMessagePage
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
      path: '/discovery-process/:surveyProduct(eq|values|behaviours)/:surveyUserId(\\d+)',
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
      path: '/discovery-process/:surveyProduct(eq|values|behaviours)/:surveyUserId(\\d+)/completed',
      component: DpChildSurveyCompletedPage,
      props: true,
      name: 'survey.dp.completed.part'
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
  // todo::[m] this incorrect works,  'user/isAuthenticated' is not initialised there
  // todo::[m] allow access for non authenticated only at page survey.welcome, at other page we need redirect users to 404
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
