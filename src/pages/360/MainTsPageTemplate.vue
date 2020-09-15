<template>
  <router-view v-if="tsUserInfo"></router-view>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { User, TsUserDto } from '@/interfaces'
import TsService from '@/services/TsService'

@Component({
  name: 'MainTsPageTemplate'
})
export default class MainTsPageTemplate extends Vue {
  @Prop()
  tsSurveyId!: number

  @Getter('ts/getUser')
  tsUserInfo!: TsUserDto

  @Getter('user/currentUser')
  user!: User

  async created () {
    if (!this.tsUserInfo) {
      const tsUser = await TsService.getUserInfo(this.tsSurveyId, this.user.id)
      this.$store.commit('ts/setTsUser', tsUser)
    }
  }
}
</script>
