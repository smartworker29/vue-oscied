<template>
  <div class="icoach">
    <div class="icoach-header">
      <div class="breadcrumbs">
        <router-link :to="{ name: 'icoach.dashboard', params: { icoachUserId: icoachUserId } }">
          <span>{{ $t(`skills.categories.${icoachUserData.icoachSkillCategoryId}`) }}</span>
        </router-link>
      </div>
      <h1 class="icoach-title">
        {{ icoachUserData.icoachCourseTitle }}
      </h1>
    </div>
    <h2>{{ icoachSkill ? icoachSkill.name : '' }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IcoachLocalStorageHelper from '@/utils/IcoachLocalStorageHelper'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import { IcoachSkill } from '@/interfaces/IcoachInterfaces'

@Component
export default class IcoachCoursePage extends Vue {
  @Prop({})
  icoachUserId!: number
  @Prop({})
  skillId!: number
  @Prop({})
  stepId!: number

  icoachUserData: IcoachData | null = null
  icoachSkill: IcoachSkill | null = null

  async created () {
    if (!IcoachLocalStorageHelper.hasIcoachUser(this.icoachUserId)) {
      this.$router.push({ name: 'notFound' })

      return
    }

    this.icoachUserData = IcoachLocalStorageHelper.getIcoachUser(this.icoachUserId)
    // todo::[m] check icoachUserData
  }
}
</script>
