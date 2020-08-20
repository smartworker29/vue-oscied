<template>
  <div class="container">
    <div class="ipulse-section-wrapper">
      <div class="ipulse-description">
        <p v-html="currentSectionData && currentSectionData.instructions
          ? currentSectionData.instructions : $t('sorting_g.description')">
        </p>
      </div>
      <range-slider-sorting-statement :statements="statements" @update-order="completeSection" v-if="statements.length"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SurveyService from '@/services/SurveyService'
import { IpulseSortingStatement, IpulseStatement, Section } from '@/interfaces/SurveyInterfaces'
import DragAndDropSortingStatement from '@/components/common/sorting/DragAndDropSortingStatement.vue'
import TapSortingStatement from '@/components/common/sorting/TapSortingStatement.vue'
import RangeSlider from '@/components/common/rangeSlider/RangeSlider.vue'
import RangeSliderSortingStatement from '@/components/common/sorting/RangeSliderSortingStatement.vue'

@Component({
  name: 'TakenIpulseSection',
  components: {
    DragAndDropSortingStatement,
    TapSortingStatement,
    RangeSlider,
    RangeSliderSortingStatement
  }
})
export default class TakenIpulseSection extends Vue {
  @Getter('survey/getNextTakenSurveySection')
  currentSectionData!: Section

  isWideScreen: boolean = window.innerWidth > 1024;
  statements: IpulseStatement[] = []

  async created () {
    const section: Section | null = this.$store.getters['survey/getNextTakenSurveySection']
    if (!section) {
      throw new Error()
      // todo::[m] if section is null
    }
    this.statements = await SurveyService.getIpulseSectionStatements(section.id)
    // todo::[m] if statements don't return

    window.addEventListener('resize', () => {
      this.isWideScreen = window.innerWidth > 1024
    })
  }

  completeSection (statements: IpulseSortingStatement[]) {
    this.$emit('completeIpulseSection', statements)
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
</style>
