<template>
  <div class="survey ts-user-dashboard">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', {surveyName: (surveyInfo) ? surveyInfo.title : ''}) }}</h1>
      <div class="ratees-filter" v-if="hasRoleRater">
        <div class="form-group sort-by">
          <label>
            {{ $t('sort.by_title') }}
          </label>
          <multiselect
            v-model="orderBy"
            name="order_by"
            label="text"
            track-by="number"
            :placeholder="$t('sort.by_title')"
            :searchable="false"
            :show-labels="false"
            :options="sortItemList">
          </multiselect>
        </div>
        <div class="form-group show-completed">
          <div class="checkbox-input">
            <label for="isShowCompleted">{{ $t('show_completed') }}</label>
            <input type="checkbox" v-model="isShowCompleted" id="isShowCompleted">
          </div>
        </div>
      </div>
    </div>
    <div class="survey-content">
      <div class="all-ratees">
        <div class="ratees-block user-ratees" v-if="myRatees.length > 0">
          <h2>{{ $t('my_rating') }}</h2>
          <div class="ratee-items">
            <users-ratee-card v-for="ratee in myRatees"
                              :key="ratee.id"
                              :userRatee="ratee"
                              :has-view-my-score="true"
                              @score="viewScore(ratee)"/>
          </div>
        </div>
        <div class="ratees-block raters-ratees" :class="{ full:  myRatees.length < 1 }">
          <div class="who-rating-header">
            <h2>{{ $t('who_i_rating') }}</h2>
            <div class="layout-select">
              {{ $t('layout') }} <span @click="changeLayout(1)">1</span> | <span @click="changeLayout(2)">2</span>
            </div>
          </div>
          <div class="ratee-items">
            <rater-ratee-card v-for="ratee in filteredRaterRatees"
                              :key="ratee.id"
                              :tsSurveyId="tsSurveyId"
                              :raterRatee="ratee"/>

            <div class="ratee-card users-ratee-card add-ratee" v-if="hasRoleManager">
              <div class="actions">
                <button class="btn btn-primary btn-primary-active" @click="addNewRatee">
                  {{ $t('add_new_ratee') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :classes="['ccr-modal']" name="new-ratee-modal" :height="'auto'">
      <TsAddUserModal
        :title="$t('ts.modal.add_new_ratee')"
        :submit-button="$t('ts.modal.add_new_ratee_button')"
        :modalError="modalError"
        @cancel="handleCancelModal"
        @confirm="handleConfirmModal"
        @changed="handleChangedModal"
      >
        <template slot="content">
          <p>{{ $t('ts.modal.add_new_ratee_info_1') }}</p>
          <p>{{ $t('ts.modal.add_new_ratee_info_2')}}</p>
        </template>
      </TsAddUserModal>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { SurveyInfo, TsUserDto, TsRateeUser, TsAbstractUser, TsNewUserForm } from '@/interfaces'
import TsService from '@/services/TsService'
import UsersRateeCard from '@/components/360/UsersRateeCard.vue'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'
import TsAddUserModal from '@/components/modals/TsAddUserModal.vue'

@Component({
  name: 'UserDashboardPage',
  components: {
    UsersRateeCard,
    RaterRateeCard,
    TsAddUserModal
  }
})
export default class UserDashboardPage extends Vue {
  @Prop({ required: true })
  tsSurveyId!: number

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo

  @Getter('ts/getUsers')
  tsUserInfo!: TsUserDto

  @Getter('ts/getManager')
  tsManager!: TsAbstractUser

  @Getter('ts/hasRoleRater')
  hasRoleRater!: boolean

  @Getter('ts/hasRoleManager')
  hasRoleManager!: boolean

  myRatees: TsRateeUser[] = []
  ratersRatees: TsRateeUser[] = []
  orderBy: { text: string, number: number } | null = null
  isShowCompleted = false
  modalError: string = ''

  async created () : Promise<void> {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    await this.uploadRaterRatee()
    this.myRatees = await TsService.uploadUserRatee(this.tsSurveyId)
  }

  get sortItemList () : any {
    return [
      { text: this.$t('sort.last_review_asc'), number: 1 },
      { text: this.$t('sort.last_review_desc'), number: 2 }
    ]
  }

  get filteredRaterRatees () : TsRateeUser[] {
    let result = this.ratersRatees

    if (this.isShowCompleted) {
      // todo::change filter for complete field
      result = result.filter((ratee: TsRateeUser) => ratee.id !== 2)
    }

    // todo::add ordering
    // switch (this.orderBy.number) {
    //   case 1:
    //     this.queryParameters['orderBy'] = 'lastReview'
    //     this.queryParameters['direction'] = 'asc'
    //     break
    //   case 2:
    //     this.queryParameters['orderBy'] = 'lastReview'
    //     this.queryParameters['direction'] = 'desc'
    //     break
    // }

    return result
  }

  changeLayout (layout: number) : void {
    alert('seleected layout ' + layout)
  }

  async uploadRaterRatee () : Promise<void> {
    if (this.hasRoleManager) {
      this.ratersRatees = await TsService.getRateeList(this.tsSurveyId)
    } else if (this.hasRoleRater) {
      this.ratersRatees = await TsService.uploadRatersRatee(this.tsSurveyId)
    }
  }

  viewScore (ratee: TsRateeUser) {
    this.$router.push({
      name: 'survey.ts.user.results',
      params: {
        tsSurveyId: this.tsSurveyId.toString(),
        tsRaterRateeId: ratee.id.toString()
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

  async handleConfirmModal (user: TsNewUserForm) {
    try {
      const newRatee = await TsService.addRatee(this.tsSurveyId, this.tsManager.id, user)
      this.$modal.hide('new-ratee-modal')

      this.ratersRatees.push(newRatee)
    } catch (error) {
      if ('response' in error && [400, 403, 404].includes(error.response.status)) {
        const { detail } = error.response.data

        this.modalError = detail
      } else {
        throw error
      }
    }
  }
}
</script>
