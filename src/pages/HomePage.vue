<template>
  <div>
    <h1>Welcome to the EU app</h1>
    <h2>{{ testText }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import UserService from '@/services/UserService'

@Component({})
export default class Home extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean

  testText: string = 'Static test text'

  async created () {
    if (this.isAuthenticated) {
      this.testText = await UserService.test()
    }
  }
}
</script>
