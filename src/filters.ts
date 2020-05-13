import Vue from 'vue'
import dayjs from 'dayjs'

const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

Vue.filter('formatDate', function (value: string, format: string) {
  return dayjs(value).format(format)
})
