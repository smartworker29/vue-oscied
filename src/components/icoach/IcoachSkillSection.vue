<template>
  <div class="icoach-content">
    <h4>page {{ currentStep }} of {{ stepsCount }}</h4>
    <div v-html="icoachSkill ? icoachSkill.icoachSkillContents[currentStep - 1].content : ''"></div>

    <button v-if="!isFirstStep" class="btn btn-primary btn-primary-active" @click="changeStep('prev')">{{ $t('skills.back')}}</button>
    <button class="btn btn-primary btn-primary-active" @click="changeStep('next')">
      {{ isLastStep ? $t('skills.last') : $t('skills.next') }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IcoachSkill } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import IcoachHelper from '@/utils/IcoachHelper'

@Component({ name: 'IcoachSkillSection' })
export default class IcoachSkillSection extends Vue {
  @Prop({})
  icoachSkill!: IcoachSkill

  @Prop({})
  icoachUserData!: IcoachData

  @Prop({})
  stepId!: number

  stepsCount: number = 0
  currentStep: number = 0
  isLastStep: boolean = false
  isFirstStep: boolean = false

  @Watch('stepId')
  onValueChanged () {
    this.currentStep = this.stepId
    this.updateCurrentStep()
  }

  created () {
    this.stepsCount = this.icoachSkill.icoachSkillContents.length
    this.currentStep = this.stepId
    this.updateCurrentStep()
  }

  updateCurrentStep () {
    this.isFirstStep = false
    this.isLastStep = false

    if (this.currentStep === this.stepsCount) {
      this.isLastStep = true
    }

    if (this.currentStep === 1) {
      this.isFirstStep = true
    }
  }

  changeStep (direction: string) {
    switch (direction) {
      case 'prev':
        this.currentStep--
        break
      case 'next':
        this.currentStep++
    }

    this.updateCurrentStep()

    this.$emit('changeStep', this.currentStep)

    this.$store.commit('icoach/setIcoachSkillStepId', this.currentStep)
    if (this.currentStep > this.stepsCount) {
      IcoachHelper.completeIcoachSkill(this.icoachUserData.icoachCourseId, this.icoachUserData.icoachUserId)
      return this.$router.push({ name: 'icoach.skill.complete' })
    }

    this.$router.push({
      name: 'icoach.skill',
      params: {
        icoachUserId: this.icoachUserData.icoachUserId.toString(),
        skillId: this.icoachSkill.id.toString(),
        stepId: this.currentStep.toString()
      }
    })
  }
}
</script>
