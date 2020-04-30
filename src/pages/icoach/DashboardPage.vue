<template>
  <div class="icoach">
    <div class="icoach-header">
      <h1 class="icoach-title">
        <span>{{ icoachTitle }}</span>
      </h1>
    </div>
    <div class="icoach-not-found" v-if="!icoachDashboardInfo || !Object.keys(icoachDashboardInfo).length">
      {{ $t('skills.no_skills') }}
    </div>
    <div class="icoach-dashboard" v-else>
      <div class="icoach-categories">
        <ul class="icoach-category-list">
          <li
            v-for="(category, index) in icoachDashboardInfo" :key="index"
            @click="changeIndex(index)"
            :class="{ 'active': activeIndex === index }">
            <span>{{ $t(`skills.categories.${index}`) }}</span>
          </li>
        </ul>
      </div>
      <div class="icoach-content">
        <h2>
          {{ $t(`skills.categories.${activeIndex}`) }}
        </h2>
        <div class="icoach-skills">
          <router-link
            class="icoach-skill" v-for="(skills, index) in icoachDashboardInfo[activeIndex]" :key="index"
            :to="{ name: 'icoach.skill', params: { icoachUserId: icoachUserId, skillId: skills.id, stepId: 1 } }">
            <span>{{ skills.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IcoachCategories, IcoachDashboardInfo } from '@/interfaces/IcoachInterfaces'
import IcoachService from '@/services/IcoachService'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'

@Component({})
export default class DashboardPage extends Vue {
  @Prop({})
  icoachUserId!: number

  icoachDashboardInfo: IcoachDashboardInfo | null = null
  activeIndex: number = 1
  icoachTitle: string = ''

  async created () {
    if (!IcoachLocalStorageHelper.hasIcoachUser(this.icoachUserId)) {
      this.$router.push({ name: 'notFound' })

      return
    }

    try {
      this.uploadIcoachInfo()
    } catch (error) {
      this.$router.push({ name: 'notFound' })
    }
  }

  async uploadIcoachInfo () {
    const icoachUser = IcoachLocalStorageHelper.getIcoachUser(this.icoachUserId)
    if (icoachUser === null || icoachUser.icoachAccessCode === null) {
      throw new Error()
    }

    this.icoachTitle = icoachUser.icoachCourseTitle
    this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(icoachUser.icoachAccessCode)
  }

  changeIndex (index: IcoachCategories) {
    this.activeIndex = index
  }
}
</script>

<style lang="scss">
  .icoach-dashboard {
    display: flex;
    flex-wrap: wrap;
  }

  .icoach-categories {
    max-width: 30%;
  }

  .icoach-category-list {
    padding: 10px;

    li {
      cursor: pointer;
      padding: 0 24px;
      margin: 5px 0;
      font-size: 16px;
      align-items: center;
      height: 42px;
      display: flex;
      transition: 0.2s all;

      span {
        margin: 0 17px;
      }

      &:hover {
        background: #bdddff;
      }
    }

    li.active, li:hover {
      border: 1px solid #bdddff;
      border-radius: 10px;
      background: #e6f3fa;
    }
  }

  .icoach-content {
    max-width: 70%;
  }

  .icoach-skills {
    display: flex;
    flex-wrap: wrap;
  }

  .icoach-skill {
    flex: 1 0 21%;
    padding: 5px;
    margin: 5px;
    height: 100px;
    background-color: #f7fcff;
    border-radius: 5px;
    border: 1px solid #edf6fb;
    text-decoration: none;
    color: #071012;
    font-size: 16px;
  }

  .icoach-not-found {
    padding: 1% 5.5% 7px 5.5%;
  }
</style>
