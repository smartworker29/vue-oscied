<template>
  <div class="row">
    <div class="col-6 offset-6">
      <select v-model="currentLocale" @change="changeLocale" class="form-control">
        <option v-for="(localeData, index) in availableLocales"
                :key="index"
                :value="localeData.locale"
                :selected="currentLocale === localeData.locale">
                {{ localeData.localeName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LocaleHelper from '@/utils/LocaleHelper'
import { LocaleData } from '@/interfaces/UserInterfaces'

@Component({})
export default class LangSwitcher extends Vue {
  currentLocale: string | null = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en_GB'
  availableLocales: LocaleData[] = []

  created () {
    this.availableLocales = LocaleHelper.availableLocalesData
    this.currentLocale = LocaleHelper.getUserLocale()
  }

  languages = LocaleHelper

  changeLocale () {
    LocaleHelper.setUserLocale(this.currentLocale)
    window.location.reload()
  }
}
</script>
