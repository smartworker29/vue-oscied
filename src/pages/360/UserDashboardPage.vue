<template>
  <div class="survey ts-user-dashboard">
    <div class="survey-header">
      <h1 class="survey-title">
        {{
          $t("welcome_to_survey", {
            surveyName: surveyInfo ? surveyInfo.title : "",
          })
        }}
      </h1>
      <div class="ratees-filter" v-if="hasRoleRater">
        <div class="mobile-filter">Filter</div>
        <div v-if="!isMobile" class="form-group sort-by">
          <label>
            {{ $t("sort.by_title") }}
          </label>
          <multiselect
            v-model="orderBy"
            name="order_by"
            label="text"
            track-by="number"
            :placeholder="$t('sort.by_title')"
            :searchable="false"
            :show-labels="false"
            :options="sortItemList"
          >
          </multiselect>
        </div>
        <img
          class="caret-down"
          v-else
          :src="require('@/assets/icons/icon-arrow-down-white.svg')"
        />
        <div class="form-group show-completed">
          <div class="checkbox-input">
            <label for="isShowCompleted">{{ $t("show_completed") }}</label>
            <label class="switch">
              <input
                type="checkbox"
                checked
                v-model="isShowCompleted"
                id="isShowCompleted"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="survey-content">
      <div class="all-ratees">
        <div class="ratees-block user-ratees" v-if="myRatees.length > 0">
          <h2>{{ $t("my_rating") }}</h2>
          <div class="ratee-items">
            <users-ratee-card
              v-for="ratee in myRatees"
              :key="ratee.id"
              :userRatee="ratee"
              :has-view-my-score="true"
              @score="viewScore(ratee)"
            />
          </div>
          <div v-if="hasRoleRatee && myPerformanceManager">
            <h2>{{ $t("my_performance_manager") }}</h2>
            <div class="ratee-items">
              <performance-manager-card :manager="myPerformanceManager" />
            </div>
          </div>
        </div>
        <div
          class="ratees-block raters-ratees"
          :class="{ full: myRatees.length < 1 }"
        >
          <div class="who-rating-header">
            <h2>{{ $t("who_i_rating") }}</h2>
            <div class="layout-main">
              <div class="layout-select">
                <p>{{ $t("layout") }}</p>
                <button @click="changeLayout(1)">
                  <img
                    :src="require('@/assets/icons/icon-layout-table.svg')"
                  /></button
                ><button @click="changeLayout(2)">
                  <img :src="require('@/assets/icons/icon-layout-grid.svg')" />
                </button>
              </div>
              <button
                v-if="hasRoleManager"
                class="btn-rate"
                @click="addNewRatee"
              >
                {{ $t("add_new_ratee") }}
              </button>
            </div>
          </div>
          <div class="ratee-items">
            <rater-ratee-card
              v-for="ratee in filteredRaterRatees"
              :key="ratee.id"
              :tsSurveyId="tsSurveyId"
              :raterRatee="ratee"
            />
          </div>
        </div>
      </div>
    </div>
    <modal
      :classes="['ccr-modal']"
      name="new-ratee-modal"
      :adaptive="true"
      :height="'auto'"
    >
      <TsAddUserModal
        :title="$t('ts.modal.add_new_ratee')"
        :submit-button="$t('ts.modal.add_new_ratee_button')"
        :modalError="modalError"
        @cancel="handleCancelModal"
        @confirm="handleConfirmModal"
        @changed="handleChangedModal"
      />
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import {
  SurveyInfo,
  TsUserDto,
  TsRateeUser,
  TsAbstractUser,
  TsNewUserForm,
  TsManagerUser
} from '@/interfaces'
import TsService from '@/services/TsService'
import UsersRateeCard from '@/components/360/UsersRateeCard.vue'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'
import TsAddUserModal from '@/components/modals/TsAddUserModal.vue'
import PerformanceManagerCard from '@/components/360/PerformanceManagerCard.vue'

@Component({
  name: 'UserDashboardPage',
  components: {
    UsersRateeCard,
    RaterRateeCard,
    PerformanceManagerCard,
    TsAddUserModal
  }
})
export default class UserDashboardPage extends Vue {
  @Prop({ required: true })
  tsSurveyId!: number;

  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean;

  @Getter('survey/getDisplayedBaseSurveyInfo')
  surveyInfo!: SurveyInfo;

  @Getter('ts/getUsers')
  tsUserInfo!: TsUserDto;

  @Getter('ts/getManager')
  tsManager!: TsAbstractUser;

  @Getter('ts/hasRoleRater')
  hasRoleRater!: boolean;

  @Getter('ts/hasRoleRatee')
  hasRoleRatee!: boolean;

  @Getter('ts/hasRoleManager')
  hasRoleManager!: boolean;
  isMobile: boolean = window.innerWidth < 767;
  modalWidth: string = window.innerWidth < 767 ? '600px' : '80%';
  myRatees: TsRateeUser[] = [];
  ratersRatees: TsRateeUser[] = [];
  orderBy: { text: string; number: number } | null = null;
  isShowCompleted = false;
  modalError: string = '';
  myPerformanceManager: TsManagerUser | null = null;

  async created (): Promise<void> {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    await this.uploadRaterRatee()
    this.myRatees = await TsService.uploadUserRatee(this.tsSurveyId)
    if (this.hasRoleRatee) {
      this.myPerformanceManager = await TsService.getRateeManagerInfo(
        this.myRatees[0].id
      )
    }
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 767
      this.modalWidth = this.isMobile === true ? '80%' : '600px'
    })
  }

  get sortItemList (): any {
    return [
      { text: this.$t('sort.last_review_asc'), number: 1 },
      { text: this.$t('sort.last_review_desc'), number: 2 }
    ]
  }

  get filteredRaterRatees (): TsRateeUser[] {
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

  changeLayout (layout: number): void {
    alert('selected layout ' + layout)
  }

  async uploadRaterRatee (): Promise<void> {
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
      const newRatee = await TsService.addRatee(
        this.tsSurveyId,
        this.tsManager.id,
        user
      )
      this.$modal.hide('new-ratee-modal')

      this.ratersRatees.push(newRatee)
    } catch (error) {
      if (
        'response' in error &&
        [400, 403, 404].includes(error.response.status)
      ) {
        const { detail } = error.response.data

        this.modalError = detail
      } else {
        throw error
      }
    }
  }
}
</script>
