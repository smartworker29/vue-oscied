<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

@Component({
  name: 'BarChart',
  extends: Bar,
  mixins: [reactiveProp]
})
export default class BarChart extends Mixins(reactiveProp, Bar) {
  @Prop({ required: true })
  chartData!: Chart.ChartData

  @Prop()
  options?: Chart.ChartOptions

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
