import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '@/store'
import { MainLogosTypes } from '@/interfaces/GeneralInterfaces'

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
import ResetPasswordPage from '@/pages/ResetPasswordPage.vue'
import TakenIpulseSection from '@/components/survey/TakenIpulseSection.vue'
import TakenIpulseCommentSection from '@/components/survey/TakenIpulseCommentSection.vue'
import TsSurveyWelcomePage from '@/pages/360/TsSurveyWelcomePage.vue'
import ManagerDashboardPage from '@/pages/360/ManagerDashboardPage.vue'
import ManagerRateePage from '@/pages/360/ManagerRateePage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      props: true
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFoundPage
    },
    {
      path: '/request-reset-password',
      name: 'requestResetPassword',
      component: ResetPasswordPage
    },
    {
      path: '/reset-password/:email/:token',
      name: 'resetPassword',
      component: ResetPasswordPage,
      props: true
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
      // todo::check for better solution to cast to number without ts-ignore, see https://router.vuejs.org/guide/essentials/passing-props.html#function-mode
      props (route) {
        const props = { ...route.params }
        // @ts-ignore
        props.icoachUserId = +props.icoachUserId
        // @ts-ignore
        props.stepId = +props.stepId
        // @ts-ignore
        props.skillId = +props.skillId
        return props
      },
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
      path: '/:surveyProduct(eq|values|behaviours|discovery-process|ipulse|360)/:accessCode([a-zA-Z0-9]{50})',
      name: 'survey.welcome',
      component: WelcomePage,
      props: true
    },
    {
      path: '/:surveyProduct(eq|values|behaviours|ipulse)/:surveyUserId(\\d+)/part',
      component: TakenSurveyPage,
      props: true,
      children: [
        {
          path: 'section/:sectionNumber(\\d+)',
          name: 'survey.ipulse.page.part',
          component: TakenIpulseSection,
          props: true
        },
        {
          path: 'comment',
          name: 'survey.ipulse.comment.part',
          component: TakenIpulseCommentSection,
          props: true
        },
        {
          path: ':sectionNumber(\\d+)',
          name: 'survey.page.part',
          component: TakenSurveySection,
          props: true
        }
      ]
    },
    {
      path: '/360/:tsSurveyId(\\d+)',
      component: TsSurveyWelcomePage,
      props: true,
      name: 'survey.welcome.ts.survey_product'
    },
    {
      path: '/360/:tsSurveyId(\\d+)/dashboard',
      component: ManagerDashboardPage,
      props: true,
      name: 'survey.ts.dashboard'
    },
    {
      path: '/360/:tsSurveyId(\\d+)/manager/:tsManagerRateeId(\\d+)',
      component: ManagerRateePage,
      props: true,
      name: 'survey.ts.ratee'
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
      props: true,
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

const availableIcoachLogosPages = [
  'icoach.welcome',
  'icoach.dashboard',
  'icoach.skill'
]

const availableSurveyLogosPages = [
  'survey.welcome',
  'survey.page.part',
  'survey.welcome.dp.survey_product',
  'survey.dp.page.part',
  'survey.dp.completed.part'
]

const handleMainLogoCapability = (to: Route) => {
  if (!to.name) {
    return
  }

  const logoType = store.getters['mainLogo/getType']

  if (!logoType) {
    if (availableSurveyLogosPages.includes(to.name)) {
      store.commit('mainLogo/setLogos', store.getters['survey/getCurrentLogos'])
      store.commit('mainLogo/setType', MainLogosTypes.SURVEY_LOGOS)
    } else if (availableIcoachLogosPages.includes(to.name)) {
      store.commit('mainLogo/setLogos', store.getters['icoach/getIcoachLogos'])
      store.commit('mainLogo/setType', MainLogosTypes.ICOACH_LOGOS)
    }

    return
  }

  if (logoType === MainLogosTypes.SURVEY_LOGOS && !availableSurveyLogosPages.includes(to.name)) {
    store.commit('mainLogo/clearLogos')
  }

  if (logoType === MainLogosTypes.ICOACH_LOGOS && !availableIcoachLogosPages.includes(to.name)) {
    store.commit('mainLogo/clearLogos')
  }
}

router.beforeEach((to: Route, from: Route, next: any) => {
  // todo::[m] this incorrect works,  'user/isAuthenticated' is not initialised there
  // todo::[m] allow access for non authenticated only at page survey.welcome, at other page we need redirect users to 404
  handleMainLogoCapability(to)

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
