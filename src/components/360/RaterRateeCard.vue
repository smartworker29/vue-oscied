<template>
  <div class="ratee-card rater-ratee-card">
    <div class="ratee-image">
      <img class="account-image" :src="raterRatee.image && raterRatee.image.fileURL || require('@/assets/user.png')">
    </div>
    <div class="ratee-name">
      <div class="name">{{ raterRatee.fullName }}</div>
    </div>
    <div class="info" v-if="hasRoleRater && raterRatee.isLive">
      <p class="last-reviewed" v-if="raterRatee.lastReviewed">{{ $t('last_reviewed', { date: formattedLastReviewed }) }}</p>
      <p class="review-before">{{ $t('review_before', { name: raterRatee.fullName, date: formattedExpiryDate }) }}</p>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-primary-active" v-if="false">
        {{ $t('button_g.completed') }}
      </button>
      <button class="btn btn-primary btn-primary-active" @click="reviewRatee" v-if="hasRoleRater && raterRatee.isLive">
        {{ $t('button_g.review_now') }}
      </button>
      <div v-if="tsManager">
        <div v-if="raterRatee.isLive">
          <button class="btn btn-primary btn-primary-active" @click="results">
            {{ $t('button_g.results') }}
          </button>
        </div>
        <button class="btn btn-primary btn-primary-active" @click="setup(raterRatee.id)">
          {{ $t('button_g.setup') }}
        </button>
      </div>
      <button class="btn btn-primary btn-everyday" @click="everyday" v-if="hasEveryday">
        {{ $t('button_g.everyday')}}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TsAbstractUser, TsRateeUser, TsUserDto, TsUserRole } from '@/interfaces'
import dayjs from 'dayjs'
import { Getter } from 'vuex-class'

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

  @Getter('ts/getUsers')
  tsUserInfo!: TsUserDto

  @Getter('ts/getManager')
  tsManager!: TsAbstractUser

  get formattedExpiryDate (): string {
    return (this.raterRatee.isLive && this.raterRatee.expiryTime)
      ? dayjs(this.raterRatee.expiryTime.toString()).format('DD/MM/YYYY')
      : ''
  }

  get formattedLastReviewed (): string {
    return (this.raterRatee.isLive && this.raterRatee.lastReviewed)
      ? dayjs(this.raterRatee.lastReviewed.toString()).format('DD/MM/YYYY')
      : ''
  }

  get hasRoleRater () : boolean {
    return this.tsUserInfo.roles.findIndex((role: string) => role === TsUserRole.RATER) !== -1
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

  setup (id: number): void {
    this.$router.push({
      name: 'survey.ts.manager.ratee',
      params: {
        tsSurveyId: this.tsSurveyId.toString(),
        tsManagerRateeId: id.toString()
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

  results () {}
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
