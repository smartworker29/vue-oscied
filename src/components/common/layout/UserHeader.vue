<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-nav class="ml-auto">
        <img :src="require('@/assets/user.png')" width="50px" height="50px">
        <b-nav-item-dropdown text="John Smith" right>
          <b-dropdown-item :to="{ name: 'account' }" >{{ $t('account') }}</b-dropdown-item>
          <b-dropdown-item >{{ $t('settings') }}</b-dropdown-item>
          <b-dropdown-item  @click.prevent="logout">{{ $t('logout') }}</b-dropdown-item>
          <b-dropdown-item :to="{ name: 'survey' }">Test survey</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserService from '@/services/UserService'

@Component({})
export default class UserHeader extends Vue {
  logout () : void {
    this.$auth.logout().then(async () : Promise<void> => {
      await UserService.logout()
      this.$router.push({ name: 'home' })
    })
  }
}
</script>
