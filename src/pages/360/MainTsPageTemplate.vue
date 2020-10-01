<template>
<!--  <router-view v-if="tsUserInfo"></router-view>-->
  <router-view />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { User, TsUserDto, SurveyInfo, TsUserRole } from '@/interfaces'
import TsService from '@/services/TsService'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'

@Component({
  name: 'MainTsPageTemplate'
})
export default class MainTsPageTemplate extends Vue {
  @Prop()
  tsSurveyId!: number

  @Getter('ts/getUsers')
  tsUserInfo!: TsUserDto

  @Getter('user/currentUser')
  user!: User

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  async created () {
    if (!this.tsUserInfo) {
      const tsUser = await TsService.getUserInfo(this.tsSurveyId, this.user.id)
      this.$store.commit('ts/setUsers', tsUser)
    }

    if (this.tsUserInfo.roles.includes(TsUserRole.MANAGER)) {
      this.$store.commit('ts/setManager', this.tsUserInfo.users.filter(user => user.role === TsUserRole.MANAGER)[0])
    }

    if (!this.surveyInfo) {
      const survey = await SurveyService.getSurveyInfoById(SurveyHelper.TS, this.tsSurveyId)

      this.$store.commit('survey/setTakenSurveyData', {
        productSurveyId: this.tsSurveyId,
        productSurveyType: SurveyHelper.TS,
        surveyInfo: survey
      })
    }
  }
}
</script>
