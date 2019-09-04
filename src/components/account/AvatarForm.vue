<template>
  <div class="row">
    <div class="col-12 account-sub-form">
      <h2>{{ $t('profile_picture') }}</h2>
      <img :src="require('@/assets/user.png')" width="50px" height="50px">
      <div>
        <button type="button" class="btn btn-outline-info">{{ $t('button_g.change_photo') }}</button>
        <button type="button" class="btn btn-outline-info">{{ $t('button_g.delete_photo') }}</button>
        <button type="button" class="btn btn-outline-info">{{ $t('button_g.add_photo') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class AvatarForm extends Vue {

}
</script>
