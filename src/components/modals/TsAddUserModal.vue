<template>
  <div class="ccr-confirm">
    <h2 class="ccr-modal__title">{{ title }}</h2>
    <form class="form">
      <div class="form-group row">
        <p class="error" v-if="modalError">{{ modalError }}</p>
        <label class="col-md-4 col-form-label">{{ $t('email_address') }}</label>
        <input
          class="form-control col-md-8"
          type="text"
          name="email"
          v-model="user.email"
          v-validate="'required|email'"
        >
        <p class="error" v-if="errors">{{ errors.first('email') }}</p>
        <label class="col-md-4 col-form-label">{{ $t('full_name') }}</label>
        <input
          class="form-control col-md-8"
          type="text"
          name="fullName"
          v-model="user.fullName"
          v-validate="'required'"
        >
        <p class="error" v-if="errors">{{ errors.first('fullName') }}</p>
      </div>
    </form>
    <div class="ccr-modal__actions ccr-modal__actions-right">
      <button class="btn btn-primary" @click="$emit('cancel')">{{ $t('button_g.cancel') }}</button>
      <button class="btn btn-primary btn-primary-active" @click="submit">{{ $t('button_g.confirm') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { TsNewUserForm } from '@/interfaces'

@Component({ name: 'TsAddUserModal' })
export default class TsAddUserModal extends Vue {
  @Prop({ default: '' })
  title: string

  @Prop({ default: '' })
  modalError: string

  user: TsNewUserForm = {
    email: '',
    fullName: ''
  }

  @Watch('user.email')
  emailChanged () {
    this.$emit('changed')
  }

  async submit () {
    await this.$validator.validateAll()

    this.$emit('confirm', this.user)
  }
}
</script>
