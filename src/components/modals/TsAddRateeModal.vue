<template>
  <div class="ccr-confirm">
    <h2 class="ccr-modal__title">{{ $t('ts.modal.add_new_ratee') }}</h2>
    <form class="form">
      <div class="form-group row">
        <p class="error" v-if="modalError">{{ modalError }}</p>
        <label class="col-md-4 col-form-label">{{ $t('email_address') }}</label>
        <input
          class="form-control col-md-8"
          type="text"
          name="email"
          v-model="ratee.email"
          v-validate="'required|email'"
        >
        <p class="error" v-if="errors">{{ errors.first('email') }}</p>
        <label class="col-md-4 col-form-label">{{ $t('first_name') }}</label>
        <input
          class="form-control col-md-8"
          type="text"
          name="firstName"
          v-model="ratee.firstName"
          v-validate="'required'"
        >
        <p class="error" v-if="errors">{{ errors.first('firstName') }}</p>
        <label class="col-md-4 col-form-label">{{ $t('last_name') }}</label>
        <input
          class="form-control col-md-8"
          type="text"
          name="lastName"
          v-model="ratee.lastName"
          v-validate="'required'"
        >
        <p class="error" v-if="errors">{{ errors.first('lastName') }}</p>
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
import { TsNewRateeForm } from '@/interfaces'

@Component({ name: 'TsAddRateeModal' })
export default class TsAddRateeModal extends Vue {
  @Prop({ default: '' })
  modalError: string

  ratee: TsNewRateeForm = {
    email: '',
    firstName: '',
    lastName: ''
  }

  @Watch('ratee.email')
  emailChanged () {
    this.$emit('changed')
  }

  async submit () {
    await this.$validator.validateAll()

    this.$emit('confirm', this.ratee)
  }
}
</script>
