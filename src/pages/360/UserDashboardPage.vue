<template>
  <div class="survey ts-user-dashboard">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
      <div class="ratees-filter" v-if="hasRoleRater">
        <div class="form-group sort-by">
          <label>
            {{ $t('sort.by_title')}}
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
                              :userRatee="ratee" />
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
          </div>
        </div>
      </div>
    </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { SurveyInfo, TsUserDto, TsUserRole, TsRateeUser } from '@/interfaces'
import TsService from '@/services/TsService'
import UsersRateeCard from '@/components/360/UsersRateeCard.vue'
import RaterRateeCard from '@/components/360/RaterRateeCard.vue'

@Component({
  name: 'UserDashboardPage',
  components: {
    UsersRateeCard,
    RaterRateeCard
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

  myRatees: TsRateeUser[] = []
  ratersRatees: TsRateeUser[] = []
  orderBy: { text: string, number: number } | null = null
  isShowCompleted = false

  async created () : Promise<void> {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
    }

    await this.uploadRaterRatee()
    this.myRatees = await TsService.uploadUserRatee(this.tsSurveyId)
  }

  get hasRoleRater () : boolean {
    return this.tsUserInfo.roles.findIndex((role: string) => role === TsUserRole.RATER) !== -1
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
    if (this.hasRoleRater) {
      this.ratersRatees = await TsService.uploadRatersRatee(this.tsSurveyId)
    }
  }
}
</script>
