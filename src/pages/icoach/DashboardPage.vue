<template>
  <div class="icoach">
    <div class="icoach-header">
      <h1 class="icoach-title">
        <span>title</span>
      </h1>
    </div>
    <div class="icoach-dashboard">
      <div class="icoach-categories">
        <div class="icoach-category">Soft skills</div>
        <div class="icoach-category">Essential business skills</div>
        <div class="icoach-category">Organisational skills</div>
      </div>
      <div class="icoach-skills"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { IcoachDashboardInfo, IcoachGeneralInfo } from '@/interfaces/IcoachInterfaces'
import IcoachService from '@/services/IcoachService'

@Component({})
export default class DashboardPage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Getter('icoach/getIcoachInfo')
  icoachInfo!: IcoachGeneralInfo

  @Prop({})
  icoachUserId!: number

  icoachDashboardInfo: IcoachDashboardInfo | null = null

  async created () {
    if (!this.icoachUserId || !this.isAuthenticated) {
      this.$router.push({ name: 'notFound' })

      return
    }

    try {
      this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(this.icoachInfo.accessCode)
    } catch (error) {
      this.$router.push({ name: 'notFound' })
    }
  }
}
</script>

<style lang="scss">
  .icoach-dashboard {
    display: flex;
    flex-wrap: wrap;
  }
</style>
