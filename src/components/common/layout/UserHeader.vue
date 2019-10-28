<template>
  <div class="navbar">
    <div class="wrap">
      <!-- <div class="hamburger-menu-wrapper">
        <div class="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div> -->
      <SurveyLogos v-if="currentSurveyInfo" :items="currentSurveyInfo.logos || currentSurveyInfo.survey.logos" />
      <img v-else class="navbar-logo" :src="require('@/assets/logo-ccr-black.svg')" />
    </div>
    <div class="wrap">
      <template v-if="isAuthenticated">
        <div class="account-drop-down" :class="{ 'active': isActiveAccountMenu }">
          <div
            class="account-drop-down__select"
            @click="isActiveAccountMenu = !isActiveAccountMenu">
            <img class="account-drop-down_user-image" :src="require('@/assets/user.png')">
            <span class="account-drop-down_user-name">{{ userName }}</span>
            <img v-if="!isActiveAccountMenu" :src="require('@/assets/icons/icon-arrow-down-xs-blue.svg')">
            <img v-else :src="require('@/assets/icons/icon-arrow-down-xs-white.svg')">
          </div>
          <div class="account-drop-down__content">
            <ul class="account-drop-down__menu-list">
              <li @click="$router.push({ name: 'account' }); isActiveAccountMenu = false">
                <img :src="require('@/assets/icons/account.svg')">
                <span>Account</span>
              </li>
              <li>
                <img :src="require('@/assets/icons/settings.svg')">
                <span>Settings</span>
              </li>
              <li @click.prevent="logout">
                <img :src="require('@/assets/icons/icon-logout-white.svg')">
                <span>Log out</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="header-icon">
          <img :src="require('@/assets/icons/icon-alert-blue.svg')">
        </div>
        <div class="header-logout header-icon"  @click.prevent="logout">
          <img :src="require('@/assets/icons/icon-logout-blue.svg')">
        </div>
      </template>
      <template v-else>
        <LangSwitcher class="language-header" />
      </template>
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
import { SurveyInfo } from '@/interfaces/SurveyInterfaces'
import SurveyLogos from '@/components/survey/SurveyLogos.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'

@Component({
  components: {
    SurveyLogos,
    LangSwitcher
  }
})
export default class UserHeader extends Vue {
  @Getter('user/isAuthenticated')
  private isAuthenticated!: boolean

  @Getter('user/currentUser')
  user!: User

  @Getter('survey/getCurrentSurveyInfo')
  currentSurveyInfo!: SurveyInfo

  isActiveAccountMenu: boolean = false

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
    min-height: 64px;
    box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.1);
    justify-content: space-between;
    &-logo {
      width: 107px;
    }
  }

  .navbar-logo {
    margin: 0 24px;
  }

  .language-header {
    margin: 0 24px;
  }

  .header-icon {
    border-left: 1px solid #d6efff;
    height: 100%;
    display: flex;
    width: 62px;
    transition: 0.2s all;
    &:hover {
      background: #bdddff;
    }
    cursor: pointer;
    img {
      margin: 0 auto;
    }
    @media only screen and (max-width: 760px) {
      display: none;
    }
  }

  .account-drop-down__menu-list {
    padding: 19px 0;
    li {
      cursor: pointer;
      padding: 0 24px;
      border: 1px solid transparent;
      font-size: 16px;
      color: #fff;
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
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .account-drop-down__content {
    overflow: hidden;
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    background: #3d5a80;
    z-index: 1;
    width: 100%;
    @media only screen and (max-width: 760px) {
      left: auto;
      right: 0;
      width: 200px;
    }
  }

  .account-drop-down {
    position: relative;
    transition: 0.2s all;
    &.active {
      .account-drop-down__select {
        background: #3d5a80;
      }
      .account-drop-down_user-name {
        color: #fff;
      }
      .account-drop-down__content {
        display: block;
      }
    }
  }

  .account-drop-down_user-name {
    padding: 0 15px;
    color: #0085cd;
  }

  .account-drop-down__select {
    cursor: pointer;
    border-left: 1px solid #d6efff;
    display: flex;
    height: 100%;
    align-items: center;
    font-size: 14px;
    padding: 0 24px;
    transition: 0.2s all;
    &:hover {
      background: #bdddff;
    }
    @media only screen and (max-width: 760px) {
      .account-drop-down_user-name {
        display: none;
      }
    }
  }

  .account-drop-down_user-image {
    width: 32px;
    height: 32px;
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
