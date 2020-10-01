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
          <button class="btn btn-primary btn-primary-active" @click="setup(ratee.id)" v-else>
            {{ $t('button_g.setup') }}
          </button>
        </div>
      </div>

      <modal :classes="['ccr-modal']" name="new-ratee-modal" :height="'auto'">
        <TsAddUserModal
          :title="$t('ts.modal.add_new_ratee')"
          :modalError="modalError"
          @cancel="handleCancelModal"
          @confirm="handleConfirmModal"
          @changed="handleChangedModal"
        />
      </modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SurveyInfo, TsAbstractUser, TsNewUserForm, TsRateeUser, TsUserDto, TsUserRole, User } from '@/interfaces'
import { Getter } from 'vuex-class'
import TsService from '@/services/TsService'
import SurveyService from '@/services/SurveyService'
import SurveyHelper from '@/utils/SurveyHelper'
import TsAddUserModal from '@/components/modals/TsAddUserModal.vue'

@Component({
  name: 'ManagerDashboardPage',
  components: { TsAddUserModal }
})
export default class ManagerDashboardPage extends Vue {
  @Prop()
  tsSurveyId !: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  @Getter('ts/getUsers')
  tsUser!: TsUserDto

  @Getter('ts/getManager')
  tsManager!: TsAbstractUser

  @Getter('user/currentUser')
  user!: User

  rateeList: TsRateeUser[] = []
  modalError: string = ''

  async created () {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    await this.checkUser()
    await this.checkSurvey()

    this.rateeList = await TsService.getRateeList(this.tsSurveyId)
  }

  async checkUser () {
    if (!this.tsUser) {
      try {
        const tsUser: TsUserDto = await TsService.getUserInfo(this.tsSurveyId, this.user.id)
        if (!tsUser.roles.includes(TsUserRole.MANAGER)) {
          await this.$router.push({ name: 'notFound' })
        }
      } catch (error) {
        if ('response' in error && error.response.status === 404) {
          await this.$router.push({ name: 'notFound' })
        } else {
          throw error
        }
      }
    }
  }

  async checkSurvey () {
    if (!this.surveyInfo) {
      const surveyInfo = await SurveyService.getSurveyInfoById(
        SurveyHelper.TS,
        this.tsSurveyId
      )

      this.$store.commit('survey/setTakenSurveyData', {
        productSurveyId: this.tsSurveyId,
        productSurveyType: SurveyHelper.TS,
        surveyInfo: surveyInfo
      })
    }
  }

  async handleConfirmModal (user: TsNewUserForm) {
    try {
      const newRatee = await TsService.addRatee(this.tsSurveyId, this.tsManager.id, user)
      this.$modal.hide('new-ratee-modal')

      this.rateeList.push(newRatee)
    } catch (error) {
      if ('response' in error && [400, 403, 404].includes(error.response.status)) {
        const { detail } = error.response.data

        this.modalError = detail
      } else {
        throw error
      }
    }
  }

  setup (id: number) {
    this.$router.push({
      name: 'survey.ts.manager.ratee',
      params: {
        tsSurveyId: this.tsSurveyId.toString(),
        tsManagerRateeId: id.toString()
      }
    })
  }

  addNewRatee () {
    this.$modal.show('new-ratee-modal')
  }

  handleCancelModal () {
    this.modalError = ''
    this.$modal.hide('new-ratee-modal')
  }

  handleChangedModal () {
    this.modalError = ''
  }

  review () {}

  results () {}
}
</script>

<style lang="scss">
  .ts-survey-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .ts-survey-item {
    border: 1px solid #d8efff;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
  }
</style>
