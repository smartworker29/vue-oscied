<template>
  <div class="rater-ratee-skill-card-wrapper">
    <span class="skill-name">{{ skill.name }}</span>
    <div class="actions">
      <button class="btn btn-primary btn-primary-active" v-if="!skill.status" @click="rate">{{ $t('button_g.rate') }}</button>
      <img v-else :src="require('@/assets/icons/icon-check.svg')" :alt="skill.name">
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { IcoachSkillShortInfo } from '@/interfaces'

@Component({
  name: 'RaterRateeSkillCard'
})
export default class RaterRateeSkillCard extends Vue {
  @Prop({ required: true })
  skill!: IcoachSkillShortInfo

  @Emit()
  rate () {
    return this.skill
  }
}
</script>
