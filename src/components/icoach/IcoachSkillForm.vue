<template>
  <div>
    <div v-if="totalScore" class="icoach-skill-form-result">
      <div class="icoach-preview-score">
        <div class="icoach-preview-score__message">
          <p>{{ $t('icoach.your_knowledge_score', { score: formattedScore }) }}</p>
          <p>{{ $t('icoach.want_to_retake_knowledge_test') }}</p>
        </div>
        <div class="icoach-preview-score__try-again">
          <button class="btn btn-primary" @click="retakeSkill">{{ $t('icoach.try_again')}}</button>
        </div>
      </div>
      <div class="icoach-skill-buttons">
        <button class="btn btn-primary" @click="changeStep('prev')">{{ $t('icoach.back')}}</button>
        <button class="btn btn-primary btn-primary-active" @click="changeStep('next')">{{ $t('icoach.next')}}</button>
      </div>
    </div>

    <form class="icoach-skill-form" v-else @submit.prevent="submit">
      <div v-for="question in questions" class="icoach-skill-form__block" :key="question.id">
        <div class="icoach-skill-form__title">{{ question.name }}</div>
        <label
          :for="`${question.id}_${option.id}`"
          v-for="option in question.icoachSkillQuestionOptions"
          class="icoach-skill-form__options"
          :key="option.id"
        >
          {{ option.name }}
          <input
            :id="`${question.id}_${option.id}`"
            type="radio"
            :name="`${question.id}_option`"
            :value="option.id"
            v-validate="'required'"
            v-model="resultList[question.id]"
          />
          <span></span>
        </label>
        <p class="error" v-if="errors.has(`${question.id}_option`)">{{ $t('icoach.required_field') }}</p>
      </div>
      <div class="icoach-skill-buttons">
        <button class="btn btn-primary" @click="changeStep('prev')">{{ $t('icoach.back')}}</button>
        <button class="btn btn-primary btn-primary-active" type="submit">{{ $t('icoach.submit_test')}}</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { IcoachSkill, IcoachSkillDirections, IcoachSkillQuestion } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import IcoachService from '@/services/IcoachService'

@Component({ name: 'IcoachSkillForm' })
export default class IcoachSkillForm extends Vue {
  @Prop({ required: true })
  icoachSkill!: IcoachSkill
  @Prop({ required: true })
  icoachUserData!: IcoachData
  @Prop({ required: true })
  stepId!: number

  questions: IcoachSkillQuestion[] = []
  resultList: object = {}
  totalScore: number | null = null

  async created () {
    await this.uploadQuestions()
  }

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    try {
      const result = await IcoachService.sendScoreForm(
        this.resultList,
        this.icoachSkill.id,
        this.icoachUserData.icoachUserId
      )

      this.resetForm()
      this.totalScore = result.score
      this.$store.commit('icoach/updateIcoachProgress', {
        currentSkill: this.icoachSkill.id,
        currentStep: this.stepId
      })
    } catch (error) {
      throw error
    }
  }

  async uploadQuestions () {
    try {
      const totalScore = await IcoachService.getIcoachSkillScore(this.icoachSkill.id, this.icoachUserData.icoachUserId)
      if (totalScore && totalScore.score) {
        this.totalScore = totalScore.score
      }

      this.questions = await IcoachService.getIcoachSkillQuestions(this.icoachSkill.id)
    } catch (error) {
      if ('response' in error && error.response.status === 400) {
        this.handleScoreErrors(error.response.data)
      }
    }
  }

  handleScoreErrors (data: object) {
    // todo::add handle logic
  }

  @Emit()
  changeStep (direction: IcoachSkillDirections) {
    return direction
  }

  resetForm () {
    this.$validator.reset()
    this.resultList = {}
  }

  retakeSkill () {
    this.totalScore = null
  }

  get formattedScore () {
    return Number(this.totalScore).toString()
  }
}
</script>

<style lang="scss" scoped>
  .icoach-skill-form-result {
    display: flex;

    .icoach-preview-score {
      flex: 3;
      display: flex;

      &__message {
        flex: 2;
        padding-top: 14px;
      }

      &__try-again {
        flex: 1;
        padding-top: 24px;
      }
    }

    .icoach-skill-buttons {
      flex: 2;
    }
  }

  .icoach-skill-form {
    padding-top: 20px;
    width: 100%;

    &__block {
      border-bottom: 1px solid #d8efff;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    &__title {
      color: #0085cd;
      font-size: 20px;
      margin-bottom: 20px;
    }

    &__options {
      font-weight: 300;
      display: block;
      position: relative;
      padding-left: 35px;
      margin-bottom: 12px;
      cursor: pointer;
      user-select: none;

      input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      span {
        position: absolute;
        top: calc(50% - 8px);
        left: 0;
        height: 16px;
        width: 16px;
        border-radius: 8px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
        border: solid 1px #e1e6e9;
      }

      // span:after {
      //   content: "";
      //   position: absolute;
      //   display: none;
      // }

      input:checked ~ span {
        background: url('../../assets/icons/icon-check.svg') no-repeat;
        background-size: 100%;
        border: none;
        box-shadow: none;
      }

      input:checked ~ span:after {
        display: block;
      }
    }

    &__options span:after {
      color: #fff;
      left: 3px;
      top: -2px;
      width: 8px;
      height: 8px;
    }
  }
</style>
