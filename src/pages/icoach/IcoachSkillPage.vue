<template>
  <div class="icoach-skill-page">
    <div class="icoach-skill-page__header">
      <div class="breadcrumbs">
        <router-link :to="{ name: 'icoach.welcome', params: { accessCode: icoachUserData.icoachAccessCode } }" class="breadcrumbs__item">
          <span>{{ icoachUserData.icoachCourseTitle }}</span>
        </router-link>
        <img src="@/assets/icons/arrow-down-xs.svg" class="breadcrumbs__arrow-right">
        <router-link :to="{ name: 'icoach.dashboard', params: { icoachUserId: icoachUserId } }" class="breadcrumbs__item">
          <span>{{ $t(`skills.categories.${icoachUserData.icoachSkillCategoryId}`) }}</span>
        </router-link>
        <img src="@/assets/icons/arrow-down-xs.svg" class="breadcrumbs__arrow-right">
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
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

  @Watch('skillId')
  onIcoachUserIdChanged () {
    this.loadData()
  }

  icoachUserData: IcoachData | null = null
  icoachSkill: IcoachSkill | null = null
  displaySkill: boolean = false
  icoachDashboardInfo: IcoachDashboardInfo | null = null
  icoachSkillStep: number = 0

  async created () {
    this.loadData()
  }

  async loadData (): Promise<void> {
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
      this.icoachSkill = await IcoachService.getIcoachSkillInfo(this.icoachUserData.icoachAccessCode, this.skillId)
      this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(this.icoachUserData.icoachAccessCode, this.icoachUserId)
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

<style lang="scss">
  .icoach-skill-page {
    position: relative;
    z-index: 1;
    background: #fff;
    height: 100%;

    &__header {
      border: 1px solid #deeeff;
    }

    &__content {
      display: flex;
      max-width: 1160px;
      padding-right: 20px;
      height: 100%;
      .icoach-skills-list {
        max-width: initial;
        padding: 55px 16px 24px;
        flex: 0 0 31.2%;
        margin-right: 0.5%;
        background-color: #fafdff;
        border-right: 1px solid #deeeff;
        position: relative;
        .icoach-category-list {
          display: none;
        }
        .icoach-skill {
          width: 100%;
        }
        &.icoach-sidebar-open {
          position: absolute;
          height: 100%;
          width: 38.7%;
          min-width: 693px;
          display: flex;
          align-items: flex-start;
          box-shadow: 2px 7px 14px 0 rgba(0, 0, 0, 0.16);
          &+.icoach-content {
            padding-left: 36%;
          }
          .icoach-skills-category-list {
            width: calc(55% - 26px);
            max-width: 320px;
          }
          .icoach-category-list {
            width: 45%;
            padding-left: 7px;
            padding-top: 5px;
            margin-right: 26px;
            display: inline-block;
            .active {
              border: solid 1px #0085cd;
              background-color: #0085cd;
              color: #fff;
              position: relative;
              &:after {
                content: '';
                position: absolute;
                right: -9px;
                top: calc(50% - 8px);
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 8px 0 8px 8px;
                border-color: transparent transparent transparent #0085cd;
              }
              .icoach-skill-name {
                color: #fff
              }
            }
          }
        }
      }
    }
  }

  .breadcrumbs {
    color: #0085cd;
    display: flex;
    padding: 10px 20px;

    img {
      width: 12px;
      margin: 0 8px;
    }
    &__item {
      color: #0085cd;
      font-size: 12px;
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
