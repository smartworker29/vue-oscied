<template>
  <div class="icoach-content">
    <h4>page {{ currentStep }} of {{ stepsCount }}</h4>
    <h2>{{ icoachSkill.icoachSkillContents[currentStep - 1].icoachSkillArea.title }}</h2>
    <div v-html="content"></div>

    <button v-if="!isFirstStep" class="btn btn-primary btn-primary-active" @click="changeStep('prev')">{{ $t('skills.back')}}</button>
    <button class="btn btn-primary btn-primary-active" @click="changeStep('next')">
      {{ isLastStep ? $t('skills.last') : $t('skills.next') }}
    </button>

    <hr class="separator">

    <icoach-skill-comment
      :icoach-skill="icoachSkill"
      :icoach-user-data="icoachUserData"
      :step-id="currentStep"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { IcoachSkill, IcoachSkillDirections } from '@/interfaces/IcoachInterfaces'
import { IcoachData } from '@/interfaces/LocalStorageInterfaces'
import IcoachHelper from '@/utils/IcoachHelper'
import IcoachSkillComment from '@/components/icoach/IcoachSkillComment.vue'

@Component({
  name: 'IcoachSkillSection',
  components: { IcoachSkillComment }
})
export default class IcoachSkillSection extends Vue {
  @Prop({ required: true })
  icoachSkill!: IcoachSkill
  @Prop({ required: true })
  icoachUserData!: IcoachData
  @Prop({ required: true })
  stepId!: number

  stepsCount: number = 0
  currentStep: number = 0
  isLastStep: boolean = false
  isFirstStep: boolean = false

  @Watch('stepId')
  onStepIdChange () {
    this.currentStep = this.stepId
    this.updateCurrentStep()
  }

  created () {
    this.stepsCount = this.icoachSkill.icoachSkillContents.length
    this.currentStep = this.stepId
    this.updateCurrentStep()
  }

  get content (): string {
    return this.icoachSkill ? this.icoachSkill.icoachSkillContents[this.currentStep - 1].content : ''
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

  @Emit()
  changeStep (direction: IcoachSkillDirections) {
    switch (direction) {
      case IcoachSkillDirections.PREV:
        this.currentStep--
        break
      case IcoachSkillDirections.NEXT:
        this.currentStep++
    }

    this.updateCurrentStep()

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

    return this.currentStep
  }
}
</script>

<style lang="scss" scoped>
  .separator {
    margin-top: 20px;
    height: 1px;
    color: #d8efff;
    background-color: #d8efff;
    border: none;
  }
</style>
