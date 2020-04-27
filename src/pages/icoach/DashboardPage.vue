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

@Component({})
export default class DashboardPage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  @Prop({})
  icoachUserId!: number

  icoachDashboardInfo: null = null

  async created () {
    if (!this.icoachUserId || !this.isAuthenticated) {
      this.$router.push({ name: 'notFound' })

      return
    }

    try {
      await this.uploadIcoachInfo()
    } catch (error) {
      this.$router.push({ name: 'notFound' })
    }
  }

  async uploadIcoachInfo () : Promise<void> {
    try {
      // this.icoachDashboardInfo = await IcoachService.getIcoachDashboardInfo(this.icoachUserId)
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
