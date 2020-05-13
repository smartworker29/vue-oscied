<template>
  <div class="icoach-skill-comment">
    <p>{{ $t('skills.comments.leave_a_comment')}}</p>
    <form class="icoach-skill-comment__form" @submit.prevent="submit" novalidate>
      <div class="row">
        <input
          class="icoach-skill-comment__input"
          type="text"
          name="comment"
          :placeholder="$t('skills.comments.leave_your_comment')"
          v-model="comment"
          v-validate="'required'"
        >
        <button type="submit" class="icoach-skill-comment__submit">{{ $t('button_g.submit') }}</button>
      </div>
      <p class="error" v-if="errors">{{ errors.first('comment') }}</p>
    </form>

    <div class="icoach-skill-comment__published-comments" v-if="publishedComments.length">
      {{ $t('skills.comments.comments')}}
      <div class="published-comment"  v-for="(comment, key) in publishedComments" :key="key">
        <img :src="comment.user.image.fileURL" class="icoach-skill-comment__logo" :alt="comment.comment">
        <span>
          <span class="icoach-skill-comment__name">{{ comment.user.fullName }}</span>
          {{ $t('skills.comments.on')}} {{ comment.date | formatDate('MMMM Do, YYYY [at] h:mm a') }}
        </span>
        <div>{{ comment.comment }}</div>
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
    margin-top: 20px;
    padding: 20px;

    &__form {
      width: 100%;
      padding-top: 20px;
    }

    &__input {
      border: 1px solid #d8efff;
      border-radius: 8px;
      padding: 5px 10px;
      width: 80%;
    }

    &__submit {
      cursor: pointer;
      float: right;
      border: 1px;
      border-radius: 12px;
      background: #00cdbf;
      padding: 7px 16px;
      color: #fff;
    }

    &__published-comments {
      padding: 10px;
      border-top: 1px solid #d8efff;
    }

    &__logo {
      border-radius: 50%;
    }
    &__name {
      color: #0085cd;
    }
  }
</style>
