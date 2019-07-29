<template>
  <b-nav :class="'navbar-expand-lg navbar-light bg-light'">
    <b-nav-item :to="{ name: 'home' }" >Home</b-nav-item>
    <template v-if="!isAuthenticated">
      <b-nav-item :to="{ name: 'signUp' }" >Sign Up</b-nav-item>
      <b-nav-item :to="{ name: 'signIn' }" >Sign In</b-nav-item>
    </template>
    <template v-else>
      <b-nav-item @click.prevent="logout()">Sign Out</b-nav-item>
    </template>
  </b-nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import UserService from '@/services/UserService'

@Component({})
export default class Header extends Vue {
  @Getter('user/isAuthenticated')
  private isAuthenticated!: boolean

  logout () {
    this.$auth.logout().then(async () : Promise<void> => {
      await UserService.logout()
      this.$router.push({ name: 'home' })
    })
  }
}
</script>
