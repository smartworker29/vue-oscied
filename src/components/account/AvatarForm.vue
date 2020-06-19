<template>
  <div class="row">
    <div class="col-12 card">
      <h2>{{ $t('profile_picture') }}</h2>
      <div class="form account-form">
        <image-uploader />
        <div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ImageUploader from '@/components/account/ImageUploader.vue'

@Component({ name: 'AvatarForm',
  components: {
    ImageUploader
  }
})
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
