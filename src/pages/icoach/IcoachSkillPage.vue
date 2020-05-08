<template>
  <div class="icoach-skill-page">
    <div class="icoach-skill-page__header">
      <div class="breadcrumbs">
        <router-link :to="{ name: 'icoach.welcome', params: { accessCode: icoachUserData.icoachAccessCode } }" class="breadcrumbs__item">
          <span>{{ icoachUserData.icoachCourseTitle }}</span>
        </router-link>
        <img src="@/assets/icons/icon-arrow-down-xs-blue.svg" class="breadcrumbs__arrow-right">
        <router-link :to="{ name: 'icoach.dashboard', params: { icoachUserId: icoachUserId } }" class="breadcrumbs__item">
          <span>{{ $t(`skills.categories.${icoachUserData.icoachSkillCategoryId}`) }}</span>
        </router-link>
        <img src="@/assets/icons/icon-arrow-down-xs-blue.svg" class="breadcrumbs__arrow-right">
        <span class="breadcrumbs__item breadcrumbs__item--last">{{ icoachSkill ? icoachSkill.name : '' }}</span>
      </div>
    </div>

    <div v-if="displaySkill" class="icoach-skill-page__content">
      <icoach-skill-list
        :icoach-skill="icoachSkill"
        :icoach-user-data="icoachUserData"
        :icoach-dashboard-info="icoachDashboardInfo"
        :step-id="icoachSkillStep"
        @change-step="pushToAnotherStep"
      />
      <icoach-skill-section
        :icoach-skill="icoachSkill"
        :icoach-user-data="icoachUserData"
        :step-id="icoachSkillStep"
        @change-step="pushToAnotherStep"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import { IcoachDashboardInfo, IcoachSkill } from '@/interfaces/IcoachInterfaces'
import IcoachService from '@/services/IcoachService'
import IcoachSkillSection from '@/components/icoach/IcoachSkillSection.vue'
import IcoachSkillList from '@/components/icoach/IcoachSkillList.vue'

@Component({
  name: 'IcoachSkillPage',
  components: { IcoachSkillSection, IcoachSkillList }
})
export default class IcoachSkillPage extends Vue {
  @Prop({ required: true })
  icoachUserId!: number
  @Prop({ required: true })
  skillId!: number
  @Prop({ required: true })
  stepId!: number

  icoachUserData: IcoachData | null = null
  icoachSkill: IcoachSkill | null = null
  displaySkill: boolean = false
  icoachDashboardInfo: IcoachDashboardInfo | null = null
  icoachSkillStep: number = 0

  async created () {
    if (!IcoachLocalStorageHelper.hasIcoachUser(this.icoachUserId)) {
      this.$router.push({ name: 'notFound' })

      return
    }

    this.icoachUserData = IcoachLocalStorageHelper.getIcoachUser(this.icoachUserId)

    await this.uploadIcoachSkillInfo()

    this.icoachSkillStep = this.stepId
    this.displaySkill = true
  }

  async uploadIcoachSkillInfo (): Promise<void> {
    if (!this.icoachUserData || !this.icoachUserData.icoachAccessCode) {
      throw new Error()
    }

    try {
      this.icoachSkill = await IcoachService.getIcoachSkillInfo(this.skillId)
      this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(this.icoachUserData.icoachAccessCode)
    } catch (e) {
      this.$router.push({ name: 'notFound' })
    }

    this.$store.commit('icoach/setIcoachSkillStepId', 1)
  }

  pushToAnotherStep (stepId: number) : void {
    this.icoachSkillStep = stepId
  }
}
</script>

<style lang="scss" scoped>
  .icoach-skill-page {
    background: #fff;
    height: 100%;

    &__header {
      border: 1px solid #deeeff;
    }

    &__content {
      display: flex;
    }
  }

  .breadcrumbs {
    color: #0085cd;
    display: flex;
    padding: 5px 10px;

    &__arrow-right {
      transform: rotate(270deg);
    }

    &__item {
      color: #0085cd;
      padding: 0 3px;

      &--last {
        color: #3d5a80;
      }
    }

    a {
      color: #0085cd;
      text-decoration: none;

      &:visited {
        color: #0085cd;
      }
    }
  }
</style>
