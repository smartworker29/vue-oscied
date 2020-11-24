<template>
  <div class="dashboard-page">
    <div class="dashboard-content">
      <h2 class="dashboard-content-title">{{ $t("dashboard.title") }}</h2>
      <div class="dashboard-items" v-if="dashboardItems">
        <DashboardItem
          v-for="(item, index) in dashboardItems"
          :key="index"
          :item="item.item"
          :type="item.type"
          :title="item.title"
          @click.native="openItem(item.accessCode, item.type)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DashboardItem from './DashboardItem.vue'
import {
  DashboardBaseItem,
  DashboardSurveyItem,
  DashboardIcoachItem,
  DashboardTsItem
} from '@/interfaces'
import DashboardService from '@/services/DashboardService'

interface DashboardItemTemplateInterface {
  title: string;
  type: string;
  accessCode: string;
  item: DashboardBaseItem;
}

@Component({
  components: {
    DashboardItem
  }
})
export default class Dashboard extends Vue {
  dashboardItems: DashboardItemTemplateInterface[] = [];

  async created () {
    await this.uploadItems()
  }

  async uploadItems (): Promise<void> {
    const response = await DashboardService.getDashboardItems()
    let surveyKey!: string

    const mapDashboardSurveyItem = (surveyUser: DashboardSurveyItem) => {
      this.dashboardItems.push({
        title: surveyUser.surveyProduct.survey.title,
        type: surveyKey,
        accessCode: surveyUser.surveyProduct.survey.accessCode,
        item: surveyUser
      })
    }

    const mapDashboardTsItem = (tsSurvey: DashboardTsItem) => {
      this.dashboardItems.push({
        title: tsSurvey.survey.title,
        type: '360',
        accessCode: tsSurvey.survey.accessCode,
        item: tsSurvey
      })
    }

    surveyKey = 'eq'
    response.eq.forEach(mapDashboardSurveyItem)

    surveyKey = 'values'
    response.values.forEach(mapDashboardSurveyItem)

    surveyKey = 'behaviours'
    response.behaviours.forEach(mapDashboardSurveyItem)

    surveyKey = 'dp'
    response.dp.forEach(mapDashboardSurveyItem)

    surveyKey = 'ipulse'
    response.ipulse.forEach(mapDashboardSurveyItem)

    response.icoach.forEach((icoach: DashboardIcoachItem) => {
      this.dashboardItems.push({
        title: icoach.icoachCourse.title,
        type: 'icoach',
        accessCode: icoach.icoachCourse.accessCode,
        item: icoach
      })
    })

    response.tsSurvey.forEach(mapDashboardTsItem)
  }

  openItem (accessCode: string, surveyProductOrICoachType: string): void {
    if (surveyProductOrICoachType === 'icoach') {
      this.$router.push({
        name: 'icoach.welcome',
        params: { accessCode: accessCode }
      })
    } else {
      const surveyProduct =
        surveyProductOrICoachType === 'dp'
          ? 'discovery-process'
          : surveyProductOrICoachType
      this.$router.push({
        name: 'survey.welcome',
        params: { surveyProduct, accessCode }
      })
    }
  }
}
</script>

<style lang="scss"></style>
