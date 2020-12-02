<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">
        {{
          $t("welcome_to_survey", {
            surveyName: surveyInfo ? surveyInfo.title : ""
          })
        }}
      </h1>
    </div>
    <div class="survey-content" v-if="ratee">
                <button class="btn btn-primary btn-primary-active" @click="goToList">
        {{ $t("button_g.back") }}
      </button>
        <div class="survey-content-container">
      <div class="ts-ratee-full-item-wrapper">
          <div class="survey-user-title">
        <h2>{{ ratee.fullName }}</h2>
      </div>
        <div class="ts-ratee-full-item">
          <div class="icon-menu">
            <img v-if="hasRoleManager && ratee.isLive" class="left" :src="require('@/assets/icons/warning.svg')" />
            <span><img class="right" :src="require('@/assets/icons/nav-active.svg')" /></span>
          </div>
          <div class="manager-img">
            <img class="manager-image" :alt="ratee.fullName" :src="
                      (ratee.image && ratee.image.fileURL) ||
                        require('@/assets/user.png')
                    " />
          </div>
          <div class="manager-name">
            <div class="name">{{ ratee.fullName }}</div>
            <div class="email">{{ ratee.email }}</div>
            <div class="last-review">
              {{ $t("last_review") }} {{ formattedDate }}
            </div>
          </div>
          <div class="info" v-if="hasRoleRater && ratee.isLive">
            <p class="review-before">
              {{
                      $t("review_before", {
                        name: ratee.fullName,
                        date: formattedExpiryDate
                      })
                    }}
            </p>
          </div>
          <!--<button class="btn btn-primary btn-primary-active" @click="unpublish" v-if="ratee.isLive">-->
          <!--{{ $t('ts.dashboard.unpublish') }}-->
          <!--</button>-->
          <div class="actions">
            <button class="btn review btn-primary-active " v-if="hasRoleRater && ratee.isLive">
              {{ $t("button_g.review_now") }}
            </button>
            <button v-if="!ratee.isLive" class="btn btn-primary btn-primary-active" @click="publish">
              {{ $t("ts.dashboard.publish") }}
            </button>
          </div>
        </div>
      </div>
      <div class="manager-card-header">
        <b-tabs content-class="mt-3">
          <b-tab title="users" active>
            <div class="ts-ratee-manager-list-wrapper">
              <button class="btn btn-primary btn-primary-active" @click="addNewRater" v-if="!ratee.isLive">
                {{ $t("button_g.add_new_user") }}
              </button>
              <div v-if="raterList" class="ts-manager-wrapper">
                <div class="table-outer">
                  <div class="custom-table">
                    <div class="table-header">
                      <div class="header-left">
                        <div class="form-group form-check">
                          <input type="checkbox" class="form-check-input" id="user-list-checkbox"
                            v-model="checkedAll" />
                          <label class="form-check-label" for="user-list-checkbox">Name
                          </label>
                          <b-icon-chevron-down></b-icon-chevron-down>
                        </div>
                      </div>
                      <div class="header-right">
                        <!--                              <button @click="removeCheckedAll" class="outlined" :disabled="checked.length === 0">-->
                        <!--                                Remove selected-->
                        <!--                              </button>-->
                      </div>
                    </div>
                    <div class="table-body" v-for="rater in raterList" :key="rater.id">
                      <div class="table-item">
                        <div class="form-group form-check">
                          <div class="form-group-left">
                            <input type="checkbox" class="form-check-input" :id="`exampleCheck${rater.id}`"
                              v-model="checked" :value="rater.id" />
                            <img class="ts-rater-image" :alt="rater.fullName" :src="
                                      (rater.image && rater.image.fileURL) ||
                                        require('@/assets/user.png')
                                    " />
                            <label class="form-check-label"
                              :for="`exampleCheck${rater.id}`">{{ rater.fullName }}</label>
                          </div>
                          <div class="form-group-right">
                            <button class="btn btn-primary btn-primary-active remove" @click="removeRater(rater)">
                              {{ $t("button_g.remove") }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab title="skills">
            <div class="ts-ratee-skills-list-wrapper">
              <button class="btn btn-primary btn-primary-active" @click="addNewSkill" v-if="!ratee.isLive">
                {{ $t("button_g.add_new_skill") }}
              </button>
              <div v-if="groupedSkillList" class="ts-skill-wrapper">
                <div class="table-outer" v-for="(group, id) in groupedSkillList" :key="id">
                  <h4>
                    {{ $t(`icoach.categories.${id}`) }}
                  </h4>
                  <div class="custom-table">
                    <div class="table-header">
                      <div class="header-left">
                        <div class="form-group form-check">
                          <input type="checkbox" class="form-check-input" :id="`categories${id}`"
                            v-model="checkedAllGroup[id]" @click="checkGroup(id)" />
                          <label class="form-check-label" :for="`categories${id}`">Name
                          </label>
                          <b-icon-chevron-down></b-icon-chevron-down>
                        </div>
                      </div>
                      <div class="header-right">
                        <!--                              <button class="outlined" >-->
                        <!--                                Remove selected-->
                        <!--                              </button>-->
                      </div>
                    </div>
                    <div class="table-body" v-for="skill in group" :key="skill.id">
                      <div class="table-item">
                        <div class="form-group form-check">
                          <div class="form-group-left">
                            <input type="checkbox" class="form-check-input" :id="`exampleCheck${skill.id}`"
                              v-model="checkedItemGroup" :value="skill.id" />
                            <label class="form-check-label" :for="`exampleCheck${skill.id}`">{{ skill.name }}</label>
                          </div>
                          <div class="form-group-right">
                            <button class="btn btn-primary btn-primary-active remove" @click="removeSkill(skill)">
                              {{ $t("button_g.remove") }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
        <div class="manager-actions">
          <button class="btn btn-primary outlined" :disabled="checked.length === 0 && checkedItemGroup.length === 0">
            Remove selected
          </button>
        </div>
        <div class="manager-actions mobile">
          <b-dropdown text="Add" no-caret>
            <template #button-content>
              Add <b-icon-chevron-down></b-icon-chevron-down>
            </template>
            <b-dropdown-item href="#">
              <button class="btn btn-primary outlined">
                Remove selected
              </button>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <button class="btn btn-primary btn-primary-active" @click="addNewRater" v-if="!ratee.isLive">
                {{ $t("button_g.add_new_user") }}
              </button>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <button class="btn btn-primary btn-primary-active" @click="addNewSkill" v-if="!ratee.isLive">
                {{ $t("button_g.add_new_skill") }}
              </button>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>

      <!-- <button class="btn btn-primary btn-primary-active" @click="goToList">
        {{ $t("button_g.back") }}
      </button> -->
      <modal :classes="['ccr-modal']" name="new-rater-modal" :height="'auto'">
        <TsAddUserModal :title="$t('ts.modal.add_new_rater')" :submit-button="$t('ts.modal.add_new_rater_button')"
          :modalError="modalError" @cancel="handleCancelModal" @confirm="handleConfirmModal"
          @changed="handleChangedModal">
          <template slot="content">
            <p>{{ $t("ts.modal.add_new_rater_info_1") }}</p>
            <p>{{ $t("ts.modal.add_new_rater_info_2") }}</p>
          </template>
        </TsAddUserModal>
      </modal>
      <modal :classes="['ccr-modal']" name="new-skill-modal" :height="'auto'">
        <TsAddSkillModal :modalError="modalError" :groupedSkillList="groupedSkillList" @cancel="handleCancelSkillModal"
          @confirm="handleConfirmSkillModal" />
      </modal>

      <modal :classes="['ccr-modal']" name="confirm-remove-rater-modal" :height="'auto'">
        <SimpleConfirmModal :title="$t('ts.modal.remove_rater_title')" :submit-button="$t('button_g.remove')"
          :modalError="modalError" :message="$t('ts.modal.remove_rater_message')" @cancel="hideConfirmRemoveRaterModal"
          @confirm="confirmRemoveRaterModal" />
      </modal>

      <modal :classes="['ccr-modal']" name="confirm-remove-skill-modal" :height="'auto'">
        <SimpleConfirmModal :title="$t('ts.modal.remove_skill_title')" :submit-button="$t('button_g.remove')"
          :modalError="modalError" :message="$t('ts.modal.remove_skill_message')" @cancel="hideConfirmRemoveSkillModal"
          @confirm="confirmRemoveSkillModal" />
      </modal>

      <modal :classes="['ccr-modal']" name="confirm-publish-modal" :height="'auto'">
        <SimpleConfirmModal :title="$t('ts.modal.publish_ratee')" :submit-button="$t('ts.modal.publish_ratee_button')"
          :modalError="modalError" @cancel="hideConfirmPublishRatee" @confirm="confirmRemovePublishRatee">
          <template slot="content">
            <p>{{ $t("ts.modal.publish_ratee_info_1") }}</p>
            <p>{{ $t("ts.modal.publish_ratee_info_2") }}</p>
          </template>
        </SimpleConfirmModal>
      </modal>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'
import {
  IcoachSkillForm,
  IcoachSkillShortInfo,
  SurveyInfo,
  TsAbstractUser,
  TsNewUserForm,
  TsRateeUser,
  TsRaterUser,
  TsUserDto,
  User
} from '@/interfaces'
import {
  Getter
} from 'vuex-class'
import TsService from '@/services/TsService'
import TsAddUserModal from '@/components/modals/TsAddUserModal.vue'
import TsAddSkillModal from '@/components/modals/TsAddSkillModal.vue'
import SimpleConfirmModal from '@/components/modals/SimpleConfirmModal.vue'
import dayjs from 'dayjs'

  @Component({
    name: 'ManagerRateePage',
    components: {
      TsAddUserModal,
      TsAddSkillModal,
      SimpleConfirmModal
    }
  })
export default class ManagerRateePage extends Vue {
    @Prop()
    tsSurveyId!: number;

    @Prop()
    tsManagerRateeId!: number;

    @Getter('user/isAuthenticated')
    isAuthenticated!: boolean;

    @Getter('survey/getDisplayedBaseSurveyInfo')
    surveyInfo!: SurveyInfo;

    @Getter('ts/getUsers')
    tsUser!: TsUserDto;

    @Getter('ts/getManager')
    tsManager!: TsAbstractUser;

    @Getter('user/currentUser')
    user!: User;
    @Getter('ts/hasRoleRater')
    hasRoleRater!: boolean;
    @Getter('ts/hasRoleManager')
    hasRoleManager!: boolean;

    ratee: TsRateeUser | null = null;
    raterList: TsRaterUser[] = [];
    groupedSkillList: {
      [key: number]: IcoachSkillShortInfo[]
    } = {};
    modalError: string = '';
    raterToRemove: TsRaterUser | null = null;
    skillToRemove: IcoachSkillShortInfo | null = null;
    checked: Array < string > = [];
    checkedItemGroup: Array < string > = [];
    checkedAllGroup: any = {};

    get formattedDate (): string {
      if (this.ratee !== null && this.ratee.expiryTime) {
        return dayjs(this.ratee.expiryTime.toString()).format('DD/MM/YYYY')
      }
      return dayjs(new Date().toString()).format('DD/MM/YYYY')
    }

    get formattedExpiryDate (): string {
      if (this.ratee !== null && this.ratee.isLive && this.ratee.expiryTime) {
        return dayjs(this.ratee.expiryTime.toString()).format('DD/MM/YYYY')
      }
      return ''
    }

    get checkedAll () {
      return this.raterList ? this.checked.length === this.raterList.length : false
    }

    set checkedAll (value: any) {
      const selected: Array < string > = []
      if (value) {
        this.raterList.forEach(function (user: any) {
          selected.push(user.id)
        })
      }

      this.checked = selected
    }

    async removeCheckedAll () {
      this.checked = []
    }

    async checkGroup (group: any) {
      const selected: Array < string > = []

      this.checkedAllGroup[group] = !this.checkedAllGroup[group]

      for (const [key, value] of Object.entries(this.checkedAllGroup)) {
        if (key !== group) {
          this.checkedAllGroup[key] = false
        }
      }

      if (this.checkedAllGroup[group]) {
        this.groupedSkillList[group].forEach((item: any) => {
          selected.push(item.id)
        })
        this.checkedItemGroup = selected
      } else {
        this.checkedItemGroup = []
      }
    }

    async created () {
      if (!this.isAuthenticated) {
        await this.$router.push({
          name: 'notFound'
        })
      }

      await this.checkRatee()

      this.raterList = await TsService.getRaterList(this.tsManagerRateeId)
      const skillList = await TsService.getSkillList(this.tsManagerRateeId)
      this.groupedSkillList = this.groupSkills(skillList)
    }

    async checkRatee () {
      try {
        this.ratee = await TsService.getRateeInfoById(this.tsManagerRateeId)
      } catch (error) {
        if ('response' in error && error.response.status === 404) {
          await this.$router.push({
            name: 'notFound'
          })
        } else {
          throw error
        }
      }
    }

    handleCancelModal () {
      this.modalError = ''
      this.$modal.hide('new-rater-modal')
    }

    async handleConfirmModal (rater: TsNewUserForm) {
      try {
        if (!this.ratee) {
          return
        }

        const newRater = await TsService.addRater(
          this.tsManager.id,
          this.ratee.id,
          rater
        )
        this.raterList.push(newRater)
        this.$modal.hide('new-rater-modal')
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

    handleChangedModal () {
      this.modalError = ''
    }

    addNewRater () {
      this.$modal.show('new-rater-modal')
    }

    async removeRater (tsRater: TsRaterUser) {
      this.raterToRemove = tsRater
      this.$modal.show('confirm-remove-rater-modal')
    }

    async removeSkill (skill: IcoachSkillShortInfo) {
      this.skillToRemove = skill
      this.$modal.show('confirm-remove-skill-modal')
    }

    goToList () {
      return this.$router
        .push({
          name: 'survey.ts.dashboard',
          params: {
            tsSurveyId: this.tsSurveyId.toString()
          }
        })
        .catch(() => {})
    }

    hideConfirmRemoveRaterModal () {
      this.raterToRemove = null
      this.$modal.hide('confirm-remove-rater-modal')
      this.modalError = ''
    }

    hideConfirmRemoveSkillModal () {
      this.skillToRemove = null
      this.$modal.hide('confirm-remove-skill-modal')
      this.modalError = ''
    }

    async confirmRemoveRaterModal () {
      if (!this.ratee || !this.raterToRemove) {
        return
      }

      try {
        await TsService.removeRater(
          this.tsManager.id,
          this.ratee.id,
          this.raterToRemove.id
        )
      } catch (error) {
        if (
          'response' in error && [400, 403, 404].includes(error.response.status)
        ) {
          const {
            detail
          } = error.response.data

          this.modalError = detail
          return
        } else {
          throw error
        }
      }

      this.$modal.hide('confirm-remove-rater-modal')

      this.raterList = await TsService.getRaterList(this.tsManagerRateeId)
    }

    async confirmRemoveSkillModal () {
      if (!this.ratee || !this.skillToRemove) {
        return
      }

      try {
        await TsService.removeSkill(
          this.tsManager.id,
          this.ratee.id,
          this.skillToRemove.id
        )
      } catch (error) {
        if (
          'response' in error && [400, 403, 404].includes(error.response.status)
        ) {
          const {
            detail
          } = error.response.data

          this.modalError = detail
          return
        } else {
          throw error
        }
      }

      this.$modal.hide('confirm-remove-skill-modal')

      const skillList = await TsService.getSkillList(this.tsManagerRateeId)

      this.groupedSkillList = this.groupSkills(skillList)
    }

    async addNewSkill () {
      this.$modal.show('new-skill-modal')
    }

    handleCancelSkillModal () {
      this.modalError = ''
      this.$modal.hide('new-skill-modal')
    }

    async handleConfirmSkillModal (skill: IcoachSkillForm) {
      let newRateeSkill: IcoachSkillShortInfo | null = null

      try {
        if (!this.ratee) {
          return
        }

        newRateeSkill = await TsService.addSkill(
          this.tsManager.id,
          this.ratee.id,
          skill
        )
      } catch (error) {
        if (
          'response' in error && [400, 403, 404].includes(error.response.status)
        ) {
          const {
            detail
          } = error.response.data
          this.modalError = detail

          return
        } else {
          throw error
        }
      }

      this.$modal.hide('new-skill-modal')
      this.modalError = ''

      if (!newRateeSkill) {
        return
      }

      const categoryList = this.groupedSkillList[newRateeSkill.category]
        ? this.groupedSkillList[newRateeSkill.category]
        : []
      categoryList.push(newRateeSkill)

      Vue.set(this.groupedSkillList, newRateeSkill.category, categoryList)
    }

    groupSkills (
      skills: IcoachSkillShortInfo[]
    ): {
      [key: number]: IcoachSkillShortInfo[]
    } {
      return skills.reduce((rv: any, skill: IcoachSkillShortInfo) => {
        (rv[skill.category] = rv[skill.category] || []).push(skill)
        return rv
      }, {})
    }

    publish (): void {
      this.$modal.show('confirm-publish-modal')
    }

    hideConfirmPublishRatee (): void {
      this.raterToRemove = null
      this.$modal.hide('confirm-publish-modal')
      this.modalError = ''
    }

    async confirmRemovePublishRatee (): Promise < void > {
      try {
        this.ratee = await TsService.publish(
          this.tsManager.id,
          this.tsManagerRateeId
        )
        this.$modal.hide('confirm-publish-modal')
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

<style lang="scss">
.app-360 {
  .ts-manager-ratee-wrapper {
    display: flex;
  }

  .ts-ratee-full-item-wrapper {
    max-width: 282px;
    width: 100%;
  }

  .ts-rater-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .ts-ratee-full-item {
    border: 1px solid #d8efff;
    border-radius: 10px;
    padding: 10px;
    // margin: 10px;
  }

  .ts-rater-item {
    display: flex;
    padding: 10px;
    margin: 10px;
  }

  .ts-rater-image {
    display: block;
    margin: 0 auto 24px;
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
  }

  .ts-ratee-wrapper {
    display: flex;
    flex-direction: column;
  }

  .survey {
    .survey-user-title {
      h2 {
        font-size: 20px;
        font-weight: 500;
        margin: 15px 0;
      }
    }

    .ts-ratee-manager-list-wrapper {
      .ts-manager-wrapper {
        .table-outer {
          .custom-table {
            .form-group {
              .form-group-left {
                label {
                  margin-left: 20px !important;
                  text-transform: capitalize;
                }
              }
            }
          }
        }
      }
    }

    .ts-ratee-skills-list-wrapper,
    .ts-ratee-manager-list-wrapper {

      .ts-skill-wrapper,
      .ts-manager-wrapper {
        .table-outer {
          h4 {
            margin: 30px 0 24px 0;
          }

          .custom-table {
            overflow: hidden;
            border-radius: 16px;
            border: solid 1px #e6f3fa;
            border-bottom: transparent;

            p {
              margin: 0;
            }

            img {
              margin: 0 0 0 20px;
            }

            .form-group {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 0;

              .form-group-left {
                display: flex;

                input {
                  border-radius: 3px;
                  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
                  border: solid 1px #e1e6e9;
                  width: 16px;
                  height: 16px;
                }

                label {
                  margin-left: 30px;
                  color: #071012;
                }
              }

              .form-group-right {
                .btn {
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  &.remove {
                    border-radius: 8px;
                    background: #fff;
                    border: solid 1px #d6efff;
                    height: 36px;
                    font-size: 14px;
                    font-weight: 500;

                    &:hover {
                      color: #fff;
                    }
                  }
                }
              }
            }

            .table-header {
              display: flex;
              overflow: hidden;
              justify-content: space-between;
              padding: 20px 16px;
              border-bottom: solid 1px #e6f3fa;

              .header-left {
                display: flex;

                input {
                  border-radius: 3px;
                  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
                  border: solid 1px #e1e6e9;
                  width: 16px;
                  height: 16px;
                }

                label {
                  font-weight: 600;
                  margin-left: 30px;
                }

                svg {
                  margin-left: 10px;
                  color: #0085cd;
                  font-weight: 500;
                }
              }

              .header-right {
                .outlined {
                  background: transparent;
                  border: none;
                }
              }
            }

            .table-body {
              .table-item {
                border-bottom: solid 1px #e6f3fa;
                padding: 20px 16px;
                background: #fff;
              }
            }

            .table-body:nth-child(even) {
              .table-item {
                background: #f7fcff;
              }
            }
          }
        }
      }
    }

    .manager-card-header {
      display: flex;
      justify-content: space-between;

      .manager-actions {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;

        .btn-primary {
          margin-left: 10px;
          height: 36px;
          background: #0085cd;
          border-color: #0085cd;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          border-radius: 8px;

          &.outlined {
            background: transparent;
            border-color: transparent;
            color: #0085cd;
            font-size: 16px;
            font-weight: 600;

            &:hover {
              background: transparent !important;
            }
          }
        }

        &.mobile {
          display: none;
        }
      }

      @media (max-width: 992px) {
        .manager-actions {
          display: none;
        }

        .manager-actions.mobile {
          display: block;

          .dropdown {
            height: 36px;

            .dropdown-toggle {
              padding: 13px 10px;
              background: #0085cd;
              border-color: #0085cd;
              align-items: center;
              border-radius: 8px;
              display: flex;
              justify-content: center;

              svg {
                margin-left: 5px;
                font-size: 16px;
              }

              &:focus {
                outline: none;
                box-shadow: none;
              }
            }
          }
        }
      }
    }
  }

  .ts-ratee-full-item-wrapper {
    max-width: 282px;

    .ts-ratee-full-item {
      padding: 16px 16px 24px 16px;
      border-radius: 12px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
      border: solid 1px #e6f3fa;
      background-color: #ffffff;

      .actions {
        margin-top: 58px;

        .review {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          justify-content: center;
          height: 36px;
          border-radius: 8px;
          background-color: #0085cd;
          color: #fff;
        }

        .btn-primary {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          border: solid 1px #d6efff;
          height: 36px;
        }
      }

      .icon-menu {
        position: relative;
        top: 15px;
        display: flex;
        width: 100%;

        .right {
          right: 0;
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #bdddff;
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
          padding: 0 3px;
        }
      }

      .manager-img {
        text-align: center;

        img {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          border-radius: 50%;
        }
      }

      .manager-name {
        .name {
          font-size: 20px;
          text-align: center;
          color: #071012;
          line-height: 28px;
        }

        .email {
          text-align: center;
        }

        .last-review {
          color: #6a7071;
          font-size: 14px;
          margin-bottom: 12px;
          text-align: center;
        }
      }

      .info {
        .review-before {
          padding: 8px 0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          color: #0085cd;
          background-color: #f7fcff;
        }
      }
    }

    @media (max-width: 540px) {
      max-width: 100%;
      margin-bottom: 30px;

      .ts-ratee-full-item {
        margin: 0;
      }
    }
  }

  .survey {
    &-content {
      padding: 0;
      padding-left: 5% !important;
      padding-right: 5% !important;
      padding-bottom: 60px;
      background-color: #fafdff;

      &-container {
        display: grid;
        grid-template-columns: 282px calc(100% - 306px);
        grid-column-gap: 24px;

        @media screen and (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }
    }

    &-header {
      padding: 32px 5% 32px 5%;

      @media screen and (max-width: 768px) {
        padding: 24px 5% 24px 5%;
      }
    }

    &-title {
      margin-top: 0;
      font-size: 24px;
      font-weight: 300;
      color: #ffffff;
    }
  }
}
</style>
