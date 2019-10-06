<template>
  <div class="navbar">
    <div class="hamburger-menu-wrapper">
      <div class="hamburger-menu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="account">
      <b-dropdown-item :to="{ name: 'account' }" >{{ $t('account') }}</b-dropdown-item>
      <b-dropdown-item >{{ $t('settings') }}</b-dropdown-item>
      <b-dropdown-item  @click.prevent="logout">{{ $t('logout') }}</b-dropdown-item>
    </div>
    <!-- <div class="menu-items">

    </div> -->
    <!-- <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-nav class="ml-auto">
        <img :src="require('@/assets/user.png')" width="50px" height="50px">
        <b-nav-item-dropdown :text="userName" right>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import UserService from '@/services/UserService'
import { User } from '@/interfaces/UserInterfaces'

@Component({})
export default class UserHeader extends Vue {
  @Getter('user/currentUser')
  user!: User

  logout () : void {
    this.$auth.logout().then(async () : Promise<void> => {
      await UserService.logout()
      this.$router.push({ name: 'home' })
    })
  }

  get userName () : string {
    return `${this.user.firstName} ${this.user.lastName}`
  }
}
</script>

<style lang="scss">
  .navbar {
    display: flex;
    height: 64px;
    box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.1);
  }

  .hamburger-menu-wrapper {
    width: 72px;
    height: 64px;
    cursor: pointer;
    background-color: #3d5a80;
  }

  .hamburger-menu {
    top: 26px;
    left: 26px;
    width: 19px;
    height: 11px;
    position: relative;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .5s ease-in-out;
    -moz-transition: .5s ease-in-out;
    -o-transition: .5s ease-in-out;
    transition: .5s ease-in-out;
  }

.hamburger-menu span {
  display: block;
  position: absolute;
  height: 1px;
  width: 100%;
  background: #fff;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .25s ease-in-out;
  -moz-transition: .25s ease-in-out;
  -o-transition: .25s ease-in-out;
  transition: .25s ease-in-out;
}

.hamburger-menu span:nth-child(1) {
  top: 0px;
}

.hamburger-menu span:nth-child(2) {
  top: 5px;
}

.hamburger-menu span:nth-child(3) {
  top: 10px;
}

.hamburger-menu.open span:nth-child(1) {
  top: 18px;
  -webkit-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
  -o-transform: rotate(135deg);
  transform: rotate(135deg);
}

.hamburger-menu.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger-menu.open span:nth-child(3) {
  top: 18px;
  -webkit-transform: rotate(-135deg);
  -moz-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  transform: rotate(-135deg);
}
</style>
