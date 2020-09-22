<template>
  <div class="ratee-card rater-ratee-card">
    <div class="ratee-image">
      <img class="account-image" :src="raterRatee.image && raterRatee.image.fileURL || require('@/assets/user.png')">
    </div>
    <div class="ratee-name">
      <div class="name">{{ raterRatee.fullName }}</div>
    </div>
    <div class="info">
      <p class="last-reviewed">{{ $t('last_reviewed', { date: '22/06/2020' }) }}</p>
      <p class="review-before">{{ $t('review_before', { name: rateeName, date: formattedExpiryDate }) }}</p>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-primary-active" v-if="false">
        {{ $t('button_g.completed') }}
      </button>
      <button class="btn btn-primary btn-primary-active">
        {{ $t('button_g.review_now') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TsRateeUser } from '@/interfaces'
import dayjs from 'dayjs'

@Component({
  name: 'RaterRateeCard'
})
export default class RaterRateeCard extends Vue {
  @Prop({ required: true })
  raterRatee!: TsRateeUser

  get rateeName (): string {
    const namesParts = this.raterRatee.fullName.trim().split(' ')

    return namesParts.length > 1 ? namesParts[0] : this.raterRatee.fullName
  }

  get formattedExpiryDate (): string {
    return dayjs(this.raterRatee.expiryTime.toString()).format('DD/MM/YYYY')
  }
}
</script>
