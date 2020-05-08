<template>
  <div class="row">
    <div class="col-12 card">
      <h2>{{ $t('profile_picture') }}</h2>
      <div class="form account-form">
        <img class="account-image" :src="require('@/assets/user.png')">
        <div>
          <button class="btn btn-primary full-width">{{ $t('button_g.change_photo') }}</button>
          <button class="btn btn-primary full-width">{{ $t('button_g.delete_photo') }}</button>
          <button class="btn btn-primary full-width">{{ $t('button_g.add_photo') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({ name: 'AvatarForm' })
export default class AvatarForm extends Vue {

}
</script>

<style lang="scss">
  .account-image {
    display: block;
    margin: 0 auto 24px;
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
