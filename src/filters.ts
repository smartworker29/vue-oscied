import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('formatDate', function (value: string, format: string) {
  return dayjs(value).format(format)
})
