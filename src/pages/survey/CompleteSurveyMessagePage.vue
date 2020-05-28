<template>
  <div class="survey-completed-page-completed">
    <h1>{{ $t('completed_survey') }}</h1>
    <div>
      <h2>{{ title }}</h2>
    </div>
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec enim risus. Mauris efficitur felis lacinia, aliquam mauris a, imperdiet turpis. Morbi fringilla urna eros, at mattis dui sagittis ac. Curabitur eu enim nisl. Nullam ac feugiat sapien. Quisque eu purus ut diam imperdiet viverra sed at nulla. In pharetra hendrerit vestibulum.
      </p>

      <p> Donec sollicitudin, felis ut posuere aliquam, quam lorem gravida nulla, non tempor dui felis sed magna. Nulla facilisi. Fusce rhoncus faucibus ipsum at blandit. Aenean posuere tellus nec lorem maximus, ut egestas quam varius. Integer vitae nulla consequat, cursus dui non, vestibulum sem. </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ name: 'CompleteSurveyMessagePage' })
export default class CompleteSurveyMessagePage extends Vue {
  @Prop({ default: '' })
  title?: string
}
</script>

<style lang="scss">
.survey-completed-page-completed {
  padding: 30px 5.5%;
  color: #fff;
  h1 {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;

  }
  h2 {
    font-size: 32px;
    line-height: 32px;
    font-weight: 300;
  }
}
  .survey-completed-page-completed h1 {
    color: #ffffff;
  }
</style>
