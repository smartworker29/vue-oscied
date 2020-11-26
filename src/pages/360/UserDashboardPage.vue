<template>
  <div class="survey ts-user-dashboard" :class="{ 'all-ratees-manager': hasRoleManager}">
    <div class="survey-header">
      <h1 class="survey-title">
        {{
          $t("welcome_to_survey", {
            surveyName: surveyInfo ? surveyInfo.title : ""
          })
        }}
      </h1>
      <div class="ratees-filter" v-if="hasRoleRater">
        <div class="mobile-filter">Filter</div>
        <div v-if="!isMobile" class="form-group sort-by">
          <label>
            {{ $t("sort.by_title") }}
          </label>
          <multiselect v-model="orderBy" name="order_by" label="text" track-by="number"
            :placeholder="$t('sort.by_title')" :searchable="false" :show-labels="false" :options="sortItemList">
          </multiselect>
        </div>
        <img class="caret-down" v-else :src="require('@/assets/icons/icon-arrow-down-white.svg')" />
        <div class="form-group show-completed">
          <div class="checkbox-input">
            <label for="isShowCompleted">{{ $t("show_completed") }}</label>
            <label class="switch">
              <input type="checkbox" checked v-model="isShowCompleted" id="isShowCompleted" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="survey-content">

      <div class="all-ratees">
        <div class="rater-ratee-mobile-wrapper" v-if="!hasRoleManager">
          <div class="header">
            <h2>{{ $t("my_rating") }} {{ hasRoleManager }}</h2>
            <button class="rater-ratee-expand-nav" @click="toggleRateeMobileNav">
              <span v-if="!rateeMobileNav"></span>
              <span v-if="!rateeMobileNav"></span>
              <span v-if="!rateeMobileNav"></span>
              <fa v-if="rateeMobileNav" class="icon" icon="arrow-up" />
            </button>
          </div>
          <div class="content user-ratees ratees-block" :class="{'active': rateeMobileNav}">
            <div class="ratee-items">
              <users-ratee-card v-for="ratee in myRatees" :key="ratee.id" :userRatee="ratee" :has-view-my-score="true"
                @score="viewScore(ratee)" />
            </div>
          </div>
        </div>
        <div class="ratees-block user-ratees" v-if="myRatees.length > 0">
          <h2>{{ $t("my_rating") }}</h2>
          <div class="ratee-items">
            <users-ratee-card v-for="ratee in myRatees" :key="ratee.id" :userRatee="ratee" :has-view-my-score="true"
              @score="viewScore(ratee)" />
          </div>
          <div v-if="hasRoleRatee && myPerformanceManager">
            <h2>{{ $t("my_performance_manager") }}</h2>
            <div class="ratee-items">
              <performance-manager-card :manager="myPerformanceManager" />
            </div>
          </div>
        </div>
        <div class="ratees-block raters-ratees" :class="{ full:  myRatees.length < 1 }">
          <div class="who-rating-header" v-if="hasRoleManager || filteredRaterRatees.length">
            <h2>{{ $t(ratingHeader) }}</h2>
            <div class="layout-main">
              <div class="layout-select">
                <p>{{ $t('layout') }}</p>
                <button @click="changeLayout(1)">
                  <img :src="require('@/assets/icons/icon-layout-table.svg')" /></button><button
                  @click="changeLayout(2)">
                  <img :src="require('@/assets/icons/icon-layout-grid.svg')" />
                </button>
              </div>
              <button v-if="hasRoleManager" class="btn-rate" @click="addNewRatee">
                {{ $t("add_new_ratee") }}
              </button>
            </div>
          </div>
          <!-- <div v-if="hasRoleRater && myPerformanceManager && !hasRoleManager">
            <h2>{{ $t('my_performance_manager') }}</h2>
            <div class="ratee-items"><performance-manager-card :manager="myPerformanceManager" /></div>
          </div> -->
          <div class="ratee-items">
            <rater-ratee-card v-for="ratee in filteredRaterRatees" :key="ratee.id" :tsSurveyId="tsSurveyId"
              :raterRatee="ratee" />
          </div>
        </div>
      </div>
    </div>
    <modal :classes="['ccr-modal']" name="new-ratee-modal" :adaptive="true" :height="'auto'">
      <TsAddUserModal :title="$t('ts.modal.add_new_ratee')" :submit-button="$t('ts.modal.add_new_ratee_button')"
        :modalError="modalError" @cancel="handleCancelModal" @confirm="handleConfirmModal"
        @changed="handleChangedModal">
        <template slot="content">
          <p>{{ $t("ts.modal.add_new_ratee_info_1") }}</p>
        </template>
      </TsAddUserModal>
    </modal>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop
} from 'vue-property-decorator'
import {
  Getter
} from 'vuex-class'
import {
  SurveyInfo,
  TsUserDto,
  TsRateeUser,
  TsAbstractUser,
  TsNewUserForm,
  TsManagerUser,
  TsUserRole
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
    @Prop({
      required: true
    })
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
    orderBy: {
      text: string;number: number
    } | null = null;
    isShowCompleted = false;
    modalError: string = '';
    myPerformanceManager: TsManagerUser | null = null;
    rateeMobileNav: boolean = false;

    async toggleRateeMobileNav () {
      this.rateeMobileNav = !this.rateeMobileNav
    }

    async created (): Promise < void > {
      if (!this.isAuthenticated) {
        await this.$router.push({
          name: 'notFound'
        })
      }

      await this.uploadRaterRatee()
      this.myRatees = await TsService.uploadUserRatee(this.tsSurveyId)

      await this.uploadMyPerformanceManager()
      window.addEventListener('resize', () => {
        this.isMobile = window.innerWidth < 767
        this.modalWidth = this.isMobile === true ? '80%' : '600px'
      })
    }

    get sortItemList (): any {
      return [{
        text: this.$t('sort.last_review_asc'),
        number: 1
      },
      {
        text: this.$t('sort.last_review_desc'),
        number: 2
      }
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
    get ratingHeader (): string {
      return this.hasRoleManager ? 'rating_teams' : 'who_i_rating'
    }

    changeLayout (layout: number): void {}

    async uploadRaterRatee (): Promise < void > {
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

    async uploadMyPerformanceManager () {
      if (this.hasRoleRatee) {
        if (!this.myRatees.length) {
          return
        }

        this.myPerformanceManager = await TsService.getManagerInfo(TsUserRole.RATEE, this.myRatees[0].id)
      } else if (this.hasRoleRater) {
        if (!this.ratersRatees.length) {
          return
        }

        this.myPerformanceManager = await TsService.getManagerInfo(TsUserRole.RATER, this.ratersRatees[0].id)
      }
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
          'response' in error && [400, 403, 404].includes(error.response.status)
        ) {
          const {
            detail
          } = error.response.data

          this.modalError = detail
        } else {
          throw error
        }
      }
    }
}

</script>

<style lang="scss" scope>
  .survey {
    &-content {
      padding: 0;
      padding-left: 5%;
      padding-bottom: 60px;
      background-color: #fafdff;

      @media screen and (max-width: 768px) {
        padding-left: 0;
      }
    }

    &-header {
      margin-bottom: 24px;

      @media screen and (max-width: 768px) {
        margin-bottom: 0;
        padding-top: 24px;
      }
    }

    &-title {
      margin-top: 0;
      font-size: 24px;
      font-weight: 300;
      color: #ffffff;
    }
  }

  .ts-user-dashboard {

    .survey-content {
      .all-ratees {
        .rater-ratee-mobile-wrapper {
          position: relative;
          z-index: 9999;
          padding: 16px 5% 18px 5%;
          background-color: #fafdff;
          display: none;

          box-shadow: 0 9px 16px 0 rgba(0, 0, 0, 0.15);

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          h2 {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
          }

          .content {
            display: none;
            padding-top: 5% !important;
            padding-bottom: 5% !important;
            background-color: #fafdff;
            position: relative;

            &.active {
              display: block;
            }
          }

          .rater-ratee-expand-nav {
            width: 28px;
            height: 28px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-radius: 16px;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
            border: solid 1px #d6efff;
            background-color: #ffffff;
            outline: none;
            z-index: 999;

            span {
              display: block;
              width: 12px;
              height: 2px;
              background-color: #0085cd;

              &:not(:last-of-type) {
                margin-bottom: 2px;
              }
            }

            .icon {
              color: #0085cd;
            }
          }
        }

        @media screen and (max-width: 768px) {
          .user-ratees {
            display: none;
          }

          .rater-ratee-mobile-wrapper {
            display: block;
          }
        }

        .ratee-card {
          border-radius: 12px !important;
          padding: 24px !important;
          box-sizing: border-box !important;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05) !important;
          border: solid 1px #e6f3fa !important;
          background-color: #ffffff !important;

          .actions {
            .btn-primary-active {
              border-radius: 8px !important;
            }

            .btn {
              padding: 7px 32px;
            }
          }
        }

        .ratees-block {
          h2 {
            margin-bottom: 24px;
            margin-left: 0;
          }

          padding: 0;

          &.raters-ratees {
            background: #fff;
            padding-left: 24px;
            padding-right: 5.6%;
          }

          .who-rating-header {
            margin-bottom: 24px;

            @media screen and (max-width: 768px) {
              margin-top: 16px;
            }

            >h2 {
              margin-bottom: 0;
            }

            @media screen and (max-width: 768px) {
              .layout-main .btn-rate {
                font-size: 14px;
                line-height: 17px;
                padding: 7px 16px;
                margin-left: 0;
              }
            }
          }

          .ratee-items {
            grid-template-columns: 1fr 1fr 1fr;

            @media screen and (max-width: 1200px) {
              grid-template-columns: 1fr 1fr;
            }

            @media screen and (max-width: 768px) {
              grid-template-columns: 1fr;
              grid-gap: 16px;
            }

            .ratee-card {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .all-ratees-manager {
    .survey-content {
      background: #fff;
      padding-right: 5%;
      padding-left: 5%;

      .all-ratees {
        display: block;

        .ratees-block {
           &.raters-ratees {
            padding-left: 0;
            padding-right: 0;
          }
          .ratee-items {
            grid-template-columns: repeat(4, 1fr);

            @media screen and (max-width: 1200px) {
              grid-template-columns: 1fr 1fr;
            }

            @media screen and (max-width: 768px) {
              grid-template-columns: 1fr;
              grid-gap: 16px;
            }

            .ratee-card {
              width: 100%;
            }
          }
        }
      }
    }
  }

</style>
