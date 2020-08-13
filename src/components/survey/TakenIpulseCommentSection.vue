<template>
  <div class="container">
    <div class="ipulse-section-wrapper">
      <div class="ipulse-description">
        <p v-html="$t('ipulse.comment_description')"></p>
      </div>
      <form class="form ipulse-comment-form" @submit.prevent="submit" novalidate>
        <textarea v-model="comment" name="comment" class="ipulse-comment"></textarea>
        <div class="form-actions form-actions-justified">
          <button type="submit" class="btn btn-success">{{ $t('button_g.confirm') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ name: 'TakenIpulseCommentSection' })
export default class TakenIpulseCommentSection extends Vue {
  @Prop()
  surveyProduct!: string

  @Prop()
  surveyUserId!: number

  comment: string = ''

  submit () {
    this.$emit('completeIpulseCommentSection', this.comment)
  }
}
</script>

<style lang="scss">
  .ipulse-section-wrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    @media only screen and (max-width: 768px) {
      flex-wrap: wrap;
    }
  }

  .ipulse-comment-form {
    width: 100%;
    padding-top: 0;

    .ipulse-comment {
      width: 100%;
    }
  }
</style>
