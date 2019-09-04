<template>
  <div class="container">
    <h1>{{ $t('account') }}</h1>
    <div class="row">
      <div class="col-3">
        <avatar-form/>
      </div>
      <div class="offset-1 col-8">
        <profile-form/>
        <change-password-form/>
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
