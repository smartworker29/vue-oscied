<template>
  <div class="survey-logos" v-if="items">
    <div class="survey-logo" v-for="(logo, index) in items" :key="index">
      <img :src="logo.fileURL">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { SurveyLogo } from '@/interfaces/SurveyInterfaces'

@Component({ name: 'SurveyLogos' })
export default class SurveyLogos extends Vue {
  @Prop({
    default: () => ([])
  })
  items!: Array<SurveyLogo>
}
</script>
