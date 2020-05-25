<template>
  <div>
    <div v-if="totalScore">
      <p>{{ $t('icoach.you_have_answered_already') }}</p>
      <button class="btn btn-primary btn-primary-active" @click="changeStep('prev')">{{ $t('icoach.back')}}</button>
      <button class="btn btn-primary btn-primary-active" @click="changeStep('next')">{{ $t('icoach.next')}}</button>
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
        <p class="error" v-if="errors.has(`${question.id}_option`)">This field is required</p>
      </div>

      <button class="btn btn-primary btn-primary-active" @click="changeStep('prev')">{{ $t('icoach.back')}}</button>
      <button class="btn btn-primary btn-primary-active" type="submit">Submit test</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
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

  private resetForm () {
    this.$validator.reset()
    this.resultList = {}
  }
}
</script>

<style lang="scss" scoped>
  .icoach-skill-form {
    padding: 10px;
    width: 100%;

    &__block {
      border-bottom: 1px solid #d8efff;
    }

    &__title {
      color: #0085cd;
      font-size: 18px;
      padding: 10px 0;
    }

    &__options {
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
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        border: 1px #e2e7e9 solid;
      }

      span:after {
        content: "\2713";
        position: absolute;
        display: none;
      }

      input:checked ~ span {
        background-color: #2196F3;
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
