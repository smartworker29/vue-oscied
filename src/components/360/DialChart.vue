<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Doughnut, mixins } from 'vue-chartjs'
import Chart, { Easing } from 'chart.js'

const { reactiveProp } = mixins

@Component({
  name: 'DialChart',
  extends: Doughnut
})

export default class DialChart extends Mixins(reactiveProp, Doughnut) {
  @Prop({ required: true })
  chartData!: Chart.ChartData

  @Prop({ default: null })
  options?: Chart.ChartOptions

  mounted () {
    this.addPlugin({
      id: 'doughnutlabel',
      beforeDatasetDraw: (chart: Chart, args: Easing, options: any) => {
        if (chart.config.type === 'doughnut') {
          this.drawDoughnutLabel(chart, options)
        }
      }
    })
    this.renderChart(this.chartData, this.options)
  }

  drawDoughnutLabel (chart: Chart, title: string) {
    if (!title) {
      return
    }

    const ctx = chart.ctx as CanvasRenderingContext2D
    const doughnut = chart.getDatasetMeta(0).controller.chart
    const fontSize = doughnut.innerRadius / 2

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${fontSize}px Arial, sans-serif`

    const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2)
    const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2)

    ctx.fillText(title, centerX, centerY + (centerY / 2) - fontSize / 2)
  }
}
</script>
