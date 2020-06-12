<template>
  <div>
    <img class="account-image" :src="fileUrl">
    <div v-if="user.image && user.image.filePath">
      <button @click="toggleShow('change')" class="btn btn-primary full-width">
        {{ $t('button_g.change_photo') }}
      </button>
      <button @click="deleteImage" class="btn btn-primary full-width">
        {{ $t('button_g.delete_photo') }}
      </button>
    </div>
    <button v-else @click="toggleShow('add')" class="btn btn-primary full-width">
      {{$t('button_g.add_photo') }}
    </button>
    <uploader ref="cropper"
              field="img"
              @crop-success="cropSuccess"
              v-model="show"
              :width="200"
              :height="200"
              :langType="$i18n.locale"
              :params="params"
              img-format="png" />
  </div>
</template>

<script lang="ts">
import Uploader from 'vue-image-crop-upload/upload-2.vue'
import data2blob from 'vue-image-crop-upload/utils/data2blob.js'
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import UserService from '@/services/UserService'
import { Getter } from 'vuex-class'
import { ImageActions, User, Cropper } from '@/interfaces/UserInterfaces'

@Component({
  name: 'ImageUploader',
  components: {
    Uploader
  }
})

export default class ImageUploader extends Vue {
  @Getter('user/currentUser')
  user!: User

  @Prop({ default: '' })
  src!: string

  @Ref('cropper')
  readonly cropper!: Cropper

  params: object = {
    field: 'file'
  }

  private show: boolean = false
  private action: string = ''

  get fileUrl (): string {
    return this.user.image && this.user.image.fileURL ? this.user.image.fileURL : require('@/assets/user.png')
  }

  async delete () {
    try {
      const response = await UserService.deleteImage(this.user.id, this.user.image.fileName)
    } catch (error) {
      throw error
    }
  }

  async deleteImage () {
    await this.delete()
    await UserService.getUser(true)
  }

  async uploadImage (imgDataUrl: string) {
    const data = new FormData()
    const blobbed = data2blob(imgDataUrl)
    data.append('file', blobbed)

    const response = await UserService.uploadImage(this.user.id, data)
  }

  async cropSuccess (imgDataUrl: string) {
    if (this.action === ImageActions.CHANGE) {
      await this.delete()
      await this.uploadImage(imgDataUrl)
    }

    if (this.action === ImageActions.ADD) {
      await this.uploadImage(imgDataUrl)
    }

    await UserService.getUser(true)
    this.cropper.setStep(1)
  }

  toggleShow (action: ImageActions) {
    this.show = !this.show
    this.action = action
  }
}
</script>
