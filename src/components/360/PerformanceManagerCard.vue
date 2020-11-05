<template>
  <div class="ratee-card users-ratee-card">
    <div class="ratee-image">
      <img class="account-image" :src="manager.image && manager.image.fileURL || require('@/assets/user.png')">
    </div>
    <div class="ratee-name">
      <div class="email">{{ manager.email }}</div>
    </div>
    <div class="actions">
      <a :href="`mailto:${ manager.email }`" class="btn btn-primary btn-primary-active">
        {{ $t('button_g.send_email') }}
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TsManagerUser } from '@/interfaces'

@Component({
  name: 'PerformanceManagerCard'
})
export default class PerformanceManagerCard extends Vue {
  @Prop({ required: true })
  manager!: TsManagerUser
}
</script>
