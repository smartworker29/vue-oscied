<template>
  <div class="container account account-page">
    <h1>{{ $t('account') }}</h1>
    <div class="account-layout">
      <avatar-form class="account-layout-avatar" />
      <div class="account-layout-forms">
        <profile-form class="card"/>
        <change-password-form class="card"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AvatarForm from '@/components/account/AvatarForm.vue'
import ChangePasswordForm from '@/components/account/ChangePasswordForm.vue'
import ProfileForm from '@/components/account/ProfileForm.vue'

@Component({
  components: {
    AvatarForm,
    ChangePasswordForm,
    ProfileForm
  }
})
export default class AccountPage extends Vue {}
</script>

<style lang="scss">
  .account {
    &-page {
      padding: 3.5% 5.5% 60px 5.5%;
    }
    h1 {
      margin-top: -13px;
      color: #fff;
      font-size: 24px;
      margin-bottom: 21px;
      font-weight: 300;
    }

    h2 {
      font-size: 24px;
      margin: 0;
      font-weight: 300;
    }
  }

  .card {
    border-radius: 24px;
    box-shadow: 0 24px 32px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #bdddff;
    background-color: #ffffff;
    margin-bottom: 40px;
    padding: 28px 25px;
  }

  .account-layout {
    display: flex;
    justify-content: space-between;
  }

  .account-layout-avatar {
    width: 22.6%;
    .btn {
      margin-bottom: 16px;
    }
  }

  .account-layout-forms {
    width: 74.2%;
  }
</style>
