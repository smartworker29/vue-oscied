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
      <button class="btn btn-primary btn-primary-active" @click="reviewRatee">
        {{ $t('button_g.review_now') }}
      </button>
      <button class="btn btn-primary btn-everyday" @click="everyday" v-if="hasEveryday">
        {{ $t('button_g.everyday')}}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TsRateeUser } from '@/interfaces'
import dayjs from 'dayjs'

@Component({
  name: 'RaterRateeCard'
})
export default class RaterRateeCard extends Vue {
  @Prop({ required: true })
  raterRatee!: TsRateeUser

  @Prop({ required: true })
  tsSurveyId!: number

  @Prop({ default: false })
  hasEveryday!: boolean

  get rateeName (): string {
    const namesParts = this.raterRatee.fullName.trim().split(' ')

    return namesParts.length > 1 ? namesParts[0] : this.raterRatee.fullName
  }

  get formattedExpiryDate (): string {
    return (this.raterRatee.isLive && this.raterRatee.expiryTime)
      ? dayjs(this.raterRatee.expiryTime.toString()).format('DD/MM/YYYY')
      : ''
  }

  reviewRatee (): void {
    this.$router.push({
      name: 'survey.ts.user.ratee',
      params: {
        tsSurveyId: this.tsSurveyId.toString(),
        tsRaterRateeId: this.raterRatee.id.toString()
      }
    })
  }

  everyday (): void {
    this.$router.push({
      name: 'survey.ts.user.ratee.everyday',
      params: {
        tsSurveyId: this.tsSurveyId.toString(),
        tsRaterRateeId: this.raterRatee.id.toString()
      }
    })
  }
}
</script>

<style lang="scss">
.btn-everyday {
  color: #fff;
  background: #00cdbf;
  margin-top: 10px;

  &:hover {
    color: cornflowerblue;
  }
}
</style>