<template>
  <div class="icoach-skill-comment">
    <h4>{{ $t('icoach.comments.leave_a_comment')}}</h4>
    <form class="icoach-skill-comment__form" @submit.prevent="submit" novalidate>
      <div class="flex">
        <input
          class="icoach-skill-comment__input"
          type="text"
          name="comment"
          :placeholder="$t('icoach.comments.leave_your_comment')"
          v-model="comment"
          v-validate="'required'"
        >
        <button type="submit" class="icoach-skill-comment__submit">{{ $t('button_g.submit') }}</button>
      </div>
      <p class="error" v-if="errors">{{ errors.first('comment') }}</p>
    </form>

    <div class="icoach-skill-comment__published-comments" v-if="publishedComments.length">
      <h4>{{ $t('icoach.comments.comments')}}</h4>
      <div class="published-comment"  v-for="(comment, key) in publishedComments" :key="key">
        <img v-if="comment.user.image.fileURL" :src="comment.user.image.fileURL" class="icoach-skill-comment__logo" :alt="comment.comment">
        <img v-else :src="require('@/assets/user.png')" class="icoach-skill-comment__logo">
        <div class="icoach-skill-comment__content">
          <span>
            <span class="icoach-skill-comment__name">{{ comment.user.fullName }}</span>
            {{ $t('icoach.comments.on')}} {{ comment.date | formatDate('MMMM Do, YYYY [at] h:mm a') }}
          </span>
          <div>{{ comment.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IcoachSkill, IcoachSkillComment as PublishedComment } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import IcoachService from '@/services/IcoachService'

@Component({ name: 'IcoachSkillComment' })
export default class IcoachSkillComment extends Vue {
  @Prop({ required: true })
  icoachSkill!: IcoachSkill
  @Prop({ required: true })
  icoachUserData!: IcoachData
  @Prop({ required: true })
  stepId!: number

  comment: string = ''
  publishedComments: PublishedComment[] = []

  @Watch('stepId')
  onStepIdChange () {
    this.uploadComments()
    this.resetComments()
  }

  async created () {
    await this.uploadComments()
  }

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    if (!this.icoachUserData.icoachAccessCode) {
      return
    }

    try {
      const skillComment = await IcoachService.createIcoachSkillComment(
        this.icoachUserData.icoachCourseId,
        this.icoachSkill.id,
        Number(this.stepId),
        this.comment
      )

      this.comment = ''
      await this.$validator.reset()
      this.publishedComments.unshift(skillComment)

      this.$store.commit('icoach/updateIcoachProgress', {
        currentSkill: this.icoachSkill.id,
        currentStep: this.stepId
      })
    } catch (error) {
      throw error
    }
  }

  async uploadComments () {
    this.publishedComments = await IcoachService.getIcoachSkillComments(
      this.icoachSkill.id,
      this.stepId,
      this.icoachUserData.icoachUserId
    )
  }

  private resetComments () {
    this.$validator.reset()
    this.publishedComments = []
  }
}
</script>

<style lang="scss" scoped>
  .icoach-skill-comment {
    border: 1px solid #d8efff;
    background: #f7fcff;
    border-radius: 5px;
    margin-top: 30px;
    padding: 22px 23px;

    h4 {
      font-size: 20px;
      margin: 0 0 15px;
      font-weight: 300;
    }

    &__form {
      width: 100%;
    }

    &__input {
      border: 1px solid #d8efff;
      border-radius: 8px;
      padding: 9px 14px;
      background: #fff;
      width: 80%;
      font-size: 14px;
      flex: 1;
      color: rgba(7, 16, 18, 0.5);
      &:focus {
        outline: none;
      }
    }

    &__submit {
      cursor: pointer;
      float: right;
      border: 1px;
      border-radius: 12px;
      background: #00cdbf;
      padding: 7px 20px;
      color: #fff;
      margin-left: 16px;
    }

    &__published-comments {
      border-top: 1px solid #d8efff;
      margin-top: 24px;
      padding-top: 24px;
    }

    &__logo {
      border-radius: 50%;
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }
    &__name {
      color: #0085cd;
    }

    &__content {
      font-size: 14px;
      color: #6a7071;
      div {
        font-size: 16px;
        line-height: 1.5;
        color: #071012;
        font-weight: 300;
      }
    }
  }

  .published-comment {
      display: flex;
      margin-right: 17px;
      margin-bottom: 25px;
  }
</style>
