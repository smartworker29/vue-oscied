<template>
  <div class="survey">
    <div class="survey-header">
      <h1 class="survey-title">{{ $t('welcome_to_survey', { surveyName: (surveyInfo) ? surveyInfo.title : '' }) }}</h1>
    </div>
    <div class="survey-content" v-if="ratee">
      <button class="btn btn-primary btn-primary-active" @click="goToList">
        {{ $t('button_g.back') }}
     </button>
      <h2>{{ ratee.fullName }}</h2>
      <div class="ts-manager-ratee-wrapper">
        <div class="ts-ratee-full-item-wrapper">
          <div class="ts-ratee-full-item">
            <img class="account-image" :alt="ratee.fullName" :src="ratee.image && ratee.image.fileURL || require('@/assets/user.png')">
            <div>{{ ratee.fullName }}</div>
            <div>{{ ratee.email }}</div>
            <!--<button class="btn btn-primary btn-primary-active" @click="unpublish" v-if="ratee.isLive">-->
              <!--{{ $t('ts.dashboard.unpublish') }}-->
            <!--</button>-->
            <button v-if="!ratee.isLive"
                    class="btn btn-primary btn-primary-active"
                    @click="publish">
              {{ $t('ts.dashboard.publish') }}
            </button>
          </div>
        </div>

        <div class="ts-ratee-wrapper">
          <div class="ts-ratee-raters-list-wrapper">
            <button class="btn btn-primary btn-primary-active" @click="addNewRater" v-if="!ratee.isLive">
              {{ $t('button_g.add_new_user') }}
            </button>
            <div v-if="raterList" class="ts-rater-wrapper">
              <div v-for="(rater, id) in raterList" :key="id" class="ts-rater-item">
                <img class="ts-rater-image" :alt="rater.fullName" :src="rater.image && rater.image.fileURL || require('@/assets/user.png')">
                <div>{{ rater.fullName }}</div>
                <button class="btn btn-primary btn-primary-active" @click="removeRater(rater)" v-if="!ratee.isLive">
                  {{ $t('button_g.remove') }}
                </button>
              </div>
            </div>
          </div>

          <div class="ts-ratee-skills-list-wrapper">
            <button class="btn btn-primary btn-primary-active" @click="addNewSkill" v-if="!ratee.isLive">
              {{ $t('button_g.add_new_skill') }}
            </button>
            <div v-if="groupedSkillList" class="ts-skill-wrapper">
              <div v-for="(group, id) in groupedSkillList" :key="id" class="ts-skill-item">
                <h4>
                  {{ $t(`icoach.categories.${id}`) }}
                </h4>
                <div v-for="skill in group" :key="skill.id">
                  <div>{{ skill.name }}</div>
                  <button class="btn btn-primary btn-primary-active" @click="removeSkill(skill)" v-if="!ratee.isLive">
                    {{ $t('button_g.remove') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal :classes="['ccr-modal']" name="new-rater-modal" :height="'auto'">
        <TsAddUserModal
          :title="$t('ts.modal.add_new_rater')"
          :modalError="modalError"
          @cancel="handleCancelModal"
          @confirm="handleConfirmModal"
          @changed="handleChangedModal"
        />
      </modal>
      <modal :classes="['ccr-modal']" name="new-skill-modal" :height="'auto'">
        <TsAddSkillModal
          :modalError="modalError"
          :groupedSkillList="groupedSkillList"
          @cancel="handleCancelSkillModal"
          @confirm="handleConfirmSkillModal"
        />
      </modal>

      <modal :classes="['ccr-modal']" name="confirm-remove-rater-modal" :height="'auto'">
        <SimpleConfirmModal
          :title="$t('ts.modal.remove_rater_title')"
          :modalError="modalError"
          :message="$t('ts.modal.remove_rater_message')"
          @cancel="hideConfirmRemoveRaterModal"
          @confirm="confirmRemoveRaterModal"
        />
      </modal>

      <modal :classes="['ccr-modal']" name="confirm-remove-skill-modal" :height="'auto'">
        <SimpleConfirmModal
          :title="$t('ts.modal.remove_skill_title')"
          :modalError="modalError"
          :message="$t('ts.modal.remove_skill_message')"
          @cancel="hideConfirmRemoveSkillModal"
          @confirm="confirmRemoveSkillModal"
        />
      </modal>

      <modal :classes="['ccr-modal']" name="confirm-publish-modal" :height="'auto'">
        <SimpleConfirmModal
          :title="$t('ts.modal.publish_ratee')"
          :modalError="modalError"
          :message="$t('ts.modal.publish_ratee_message')"
          @cancel="hideConfirmPublishRatee"
          @confirm="confirmRemovePublishRatee"
        />
      </modal>

    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  IcoachSkillForm,
  IcoachSkillShortInfo,
  SurveyInfo, TsAbstractUser,
  TsNewUserForm,
  TsRateeUser,
  TsRaterUser,
  TsUserDto,
  User
} from '@/interfaces'
import { Getter } from 'vuex-class'
import TsService from '@/services/TsService'
import TsAddUserModal from '@/components/modals/TsAddUserModal.vue'
import TsAddSkillModal from '@/components/modals/TsAddSkillModal.vue'
import SimpleConfirmModal from '@/components/modals/SimpleConfirmModal.vue'

@Component({
  name: 'ManagerRateePage',
  components: { TsAddUserModal, TsAddSkillModal, SimpleConfirmModal }
})
export default class ManagerRateePage extends Vue {
  @Prop()
  tsSurveyId !: number

  @Prop()
  tsManagerRateeId !: number

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

  ratee: TsRateeUser | null = null
  raterList: TsRaterUser[] = []
  groupedSkillList: { [key: number]: IcoachSkillShortInfo[] } = {}
  modalError: string = ''
  raterToRemove: TsRaterUser | null = null
  skillToRemove: IcoachSkillShortInfo | null = null

  async created () {
    if (!this.isAuthenticated) {
      await this.$router.push({ name: 'notFound' })
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
        await this.$router.push({ name: 'notFound' })
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

      const newRater = await TsService.addRater(this.tsManager.id, this.ratee.id, rater)
      this.raterList.push(newRater)
      this.$modal.hide('new-rater-modal')
    } catch (error) {
      if ('response' in error && [400, 403, 404].includes(error.response.status)) {
        const { detail } = error.response.data
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
    return this.$router.push({
      name: 'survey.ts.manager.dashboard',
      params: {
        tsSurveyId: this.tsSurveyId.toString()
      }
    })
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
      await TsService.removeRater(this.tsManager.id, this.ratee.id, this.raterToRemove.id)
    } catch (error) {
      if ('response' in error && [400, 403, 404].includes(error.response.status)) {
        const { detail } = error.response.data

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
      await TsService.removeSkill(this.tsManager.id, this.ratee.id, this.skillToRemove.id)
    } catch (error) {
      if ('response' in error && [400, 403, 404].includes(error.response.status)) {
        const { detail } = error.response.data

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

      newRateeSkill = await TsService.addSkill(this.tsManager.id, this.ratee.id, skill)
    } catch (error) {
      if ('response' in error && [400, 403, 404].includes(error.response.status)) {
        const { detail } = error.response.data
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

  groupSkills (skills: IcoachSkillShortInfo[]) : { [key: number]: IcoachSkillShortInfo[] } {
    return skills.reduce((rv: any, skill: IcoachSkillShortInfo) => {
      (rv[skill.category] = rv[skill.category] || []).push(skill)
      return rv
    }, {})
  };

  publish () : void {
    this.$modal.show('confirm-publish-modal')
  }

  hideConfirmPublishRatee () : void {
    this.raterToRemove = null
    this.$modal.hide('confirm-publish-modal')
    this.modalError = ''
  }

  async confirmRemovePublishRatee () : Promise<void> {
    try {
      this.ratee = await TsService.publish(this.tsManager.id, this.tsManagerRateeId)
      this.$modal.hide('confirm-publish-modal')
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

<style lang="scss">
  .ts-manager-ratee-wrapper {
    display: flex;
  }

  .ts-ratee-full-item-wrapper {
    max-width: 275px;
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
    margin: 10px;

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
</style>
