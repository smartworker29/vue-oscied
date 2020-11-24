<template>
  <div>
    <div class="ccr-modal__header">
      <h2 class="ccr-modal__title" style="margin: 0;">{{ title }}</h2>
      <div class="ccr-modal__close">
        <span class="arrow" @click="$emit('cancel')"><fa icon="times" /></span>
      </div>
    </div>
    <slot name="content" />
    <form class="form">
      <div class="form-group">
        <p class="error" v-if="modalError">{{ modalError }}</p>
        <label class="col-md-4 col-sm-4 col-xs-12 col-form-label">{{
          $t("email_address")
        }}</label>
        <input
          class="form-control col-md-8 col-sm-8 col-xs-12"
          type="text"
          name="email"
          v-model="user.email"
          v-validate="'required|email'"
        />
        <p class="error" v-if="errors">{{ errors.first("email") }}</p>
      </div>
      <div class="form-group">
        <label class="col-md-4 col-sm-4 col-xs-12 col-form-label">{{
          $t("full_name")
        }}</label>
        <input
          class="form-control col-md-8 col-sm-8 col-xs-12"
          type="text"
          name="fullName"
          v-model="user.fullName"
          v-validate="'required'"
        />
        <p class="error" v-if="errors">{{ errors.first("fullName") }}</p>
      </div>
    </form>
    <!-- <div class="ccr-modal__actions ccr-modal__actions-right">
      <button class="btn btn-primary" @click="$emit('cancel')">
        {{ $t("button_g.cancel") }}
      </button>
      <button class="btn btn-primary btn-primary-active" @click="submit">
        {{ submitButton }}
      </button>
    </div> -->
        <div class="modal-footer" style="border-top: none; padding: 0;">
             <button class="btn btn-primary btn-primary-active" @click="submit">
        {{ submitButton }}
      </button>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { TsNewUserForm } from '@/interfaces'

@Component({ name: 'TsAddUserModal' })
export default class TsAddUserModal extends Vue {
  @Prop({ default: '' })
  title!: string;

  @Prop({ default: '' })
  submitButton!: string;

  @Prop({ default: '' })
  modalError!: string;

  user: TsNewUserForm = {
    email: '',
    firstName: '',
    lastName: ''
  };

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
