<template>
  <div>
    <form action="" class="icoach-skill-form" @submit.prevent="submit">
      <div v-for="(question, id) in questions" class="icoach-skill-form__block" :key="id">
        <div class="icoach-skill-form__title">{{ question.name }}</div>
        <label :for="`${id}_${key}`" v-for="(option, key) in question.icoachSkillQuestionOptions" class="icoach-skill-form__options" :key="key">
          {{ option.name }}
          <input :id="`${id}_${key}`" type="radio" :name="`${id}_option`" :value="key" v-validate="'required'"/>
          <span></span>
        </label>
        <p class="error" v-if="errors.has(`${id}_option`)">This field is required</p>
      </div>

      <button class="btn btn-primary btn-primary-active" @click="backStep('prev')">{{ $t('skills.back')}}</button>
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

  @Watch('stepId')
  onStepIdChange () {
    // watch it
  }

  async created () {
    await this.uploadQuestions()
  }

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    try {
      await IcoachService.sendTest('')

      // @todo::[m] fade the form, like isDisplayed - false
      await this.$validator.reset()
    } catch (error) {
      throw error
    }
  }

  async uploadQuestions () {
    this.questions = await IcoachService.getIcoachSkillQuestions(this.icoachSkill.id)
  }

  @Emit()
  backStep () {
    return IcoachSkillDirections.PREV
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
