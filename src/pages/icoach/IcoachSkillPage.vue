<template>
  <div class="icoach-skill-page">
    <div class="icoach-skill-page__header">
      <Breadcrumb :items="breadcrumbsData"/>
    </div>

    <div v-if="displaySkill" class="icoach-skill-page__content">
      <icoach-skill-list
        :icoach-skill="icoachSkill"
        :icoach-user-data="icoachUserData"
        :icoach-category-info="icoachSkillCategoryInfo"
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
import { IcoachCategorySkill, IcoachSkill } from '@/interfaces/IcoachInterfaces'
import IcoachService from '@/services/IcoachService'
import IcoachSkillSection from '@/components/icoach/IcoachSkillSection.vue'
import IcoachSkillList from '@/components/icoach/IcoachSkillList.vue'
import Breadcrumb from '@/components/common/breadcrumbs/Breadcrumb.vue'
import { BreadcrumbElement } from '@/interfaces/BreadcrumbsInterfaces'

@Component({
  name: 'IcoachSkillPage',
  components: { IcoachSkillSection, IcoachSkillList, Breadcrumb }
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
  icoachSkillStep: number = 0
  icoachSkillCategoryInfo: IcoachCategorySkill | null = null

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

  get breadcrumbsData (): BreadcrumbElement[] {
    return [
      {
        name: this.icoachUserData!.icoachCourseTitle,
        link: { name: 'icoach.welcome', params: { accessCode: this.icoachUserData && this.icoachUserData.icoachAccessCode ? this.icoachUserData.icoachAccessCode : '' } }
      },
      {
        name: this.$t(`skills.categories.${this.icoachUserData!.icoachSkillCategoryId}`),
        link: { name: 'icoach.dashboard', params: { icoachUserId: this.icoachUserId.toString() } }
      },
      {
        name: this.icoachSkill ? this.icoachSkill.name : ''
      }
    ]
  }

  async uploadIcoachSkillInfo (): Promise<void> {
    if (!this.icoachUserData || !this.icoachUserData.icoachAccessCode) {
      throw new Error()
    }

    try {
      this.icoachSkill = await IcoachService.getIcoachSkillInfo(this.icoachUserData.icoachAccessCode, this.skillId)
      this.icoachSkillCategoryInfo = await IcoachService.getIcoachSkillCategory(
        this.icoachUserData.icoachCourseId,
        this.icoachUserData.icoachUserId,
        this.icoachSkill.category
      )
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
</style>
