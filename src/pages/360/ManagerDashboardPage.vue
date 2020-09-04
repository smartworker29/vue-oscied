<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content">
      <button class="btn btn-primary btn-primary-active" @click="addNewRatee">
        {{ $t('button_g.add_new_rating_team') }}
      </button>

      <div v-if="rateeList" class="ts-survey-wrapper">
        <div v-for="(ratee, id) in rateeList" :key="id" class="ts-survey-item">
          <img class="account-image" :src="ratee.image && ratee.image.fileURL || require('@/assets/user.png')">
          <div>{{ ratee.fullName }}</div>
          <div v-if="ratee.isLive">
            <button class="btn btn-primary btn-primary-active" @click="review">
              {{ $t('button_g.review') }}
            </button>
            <button class="btn btn-primary btn-primary-active" @click="results">
              {{ $t('button_g.results') }}
            </button>
          </div>
          <button class="btn btn-primary btn-primary-active" @click="setup" v-else>
            {{ $t('button_g.setup') }}
          </button>
        </div>
      </div>

      <modal :classes="['ccr-modal']" name="new-ratee-modal" :height="'auto'">
        <TsAddRateeModal
          @cancel="handleCancelModal"
          @confirm="handleConfirmModal"
          @changed="handleChangedModal"
          :modalError="modalError"
        />
      </modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SurveyInfo, TsNewRateeForm, TsRateeUser, TsUserDto, User } from '@/interfaces'
import { Getter } from 'vuex-class'
import TsService from '@/services/TsService'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'
import TsAddRateeModal from '@/components/modals/TsAddRateeModal.vue'

@Component({
  name: 'ManagerDashboardPage',
  components: { TsAddRateeModal }
})
export default class ManagerDashboardPage extends Vue {
  @Prop()
  tsSurveyId !: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  @Getter('ts/getUser')
  tsUser!: TsUserDto

  @Getter('user/currentUser')
  user!: User

  rateeList: TsRateeUser[] = []
  modalError: string = ''

  addNewRatee () {
    this.$modal.show('new-ratee-modal')
  }

  handleCancelModal () {
    this.$modal.hide('new-ratee-modal')
  }

  async handleConfirmModal (ratee: TsNewRateeForm) {
    try {
      await TsService.addRatee(this.tsSurveyId, this.tsUser.user.id, ratee)
      this.$modal.hide('new-ratee-modal')
    } catch (error) {
      if ('response' in error && error.response.status === 404) {
        const { detail } = error.response.data
        this.modalError = detail
      } else {
        throw error
      }
    }

    this.rateeList = await TsService.getRateeList(this.tsSurveyId)
  }

  handleChangedModal () {
    this.modalError = ''
  }

  async created () {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    if (!this.surveyInfo) {
      const something = await SurveyService.getSurveyInfoById(
        SurveyHelper.TS,
        this.tsSurveyId
      )

      this.$store.commit('survey/setTakenSurveyData', {
        productSurveyId: this.tsSurveyId,
        productSurveyType: SurveyHelper.TS,
        surveyInfo: something
      })
    }

    if (!this.tsUser) {
      const tsUser = await TsService.getUserInfo(this.tsSurveyId, this.user.id)

      this.$store.commit('ts/setTsUser', tsUser)
    }

    this.rateeList = await TsService.getRateeList(this.tsSurveyId)
  }

  setup () {}

  review () {}

  results () {}
}
</script>

<style lang="scss">
  .ts-survey-wrapper {
    display: flex;
  }

  .ts-survey-item {
    border: 1px solid #d8efff;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
  }
</style>
