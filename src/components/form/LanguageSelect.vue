<template>
  <multiselect
    v-model="currentLocale"
    :searchable="false"
    track-by="locale"
    label="localeName"
    :show-labels="false"
    @select="changeLocale($event)"
    :options="availableLocales">
      <template slot="singleLabel" slot-scope="{ option }">
        <span class="flag-icon" :class="option.class"></span>
        <span class="hide-mobile">{{ option.localeName }}</span>
      </template>
      <template slot="option" slot-scope="props">
        <span class="flag-icon" :class="props.option.class"></span>
        <span class="hide-mobile">{{ props.option.localeName }}</span>
      </template>
  </multiselect>
  <!-- </div> -->
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LocaleHelper from '@/utils/LocaleHelper'
import { LocaleData } from '@/interfaces/UserInterfaces'

@Component({})
export default class LanguageSelect extends Vue {
  currentLocale: any = {}
  availableLocales: LocaleData[] = []

  created () {
    let locale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en_GB'
    this.availableLocales = LocaleHelper.availableLocalesData
    locale = LocaleHelper.getUserLocale()
    this.currentLocale = this.availableLocales.find(lang => lang.locale === locale)
  }

  changeLocale (locale) {

  }
}
</script>
