<template>
    <div class="form">
      <div class="form-group form-group-select">
        <multiselect
          v-model="currentLocale"
          :searchable="false"
          track-by="locale"
          label="localeName"
          :show-labels="false"
          @select="changeLocaleSwitcher($event)"
          :options="availableLocales">
            <template slot="singleLabel" slot-scope="{ option }">
              <span class="flag-icon" :class="option.class"></span>
              <span class="hide-mobile flag-name">{{ option.localeName }}</span>
            </template>
            <template slot="option" slot-scope="props">
              <span class="flag-icon" :class="props.option.class"></span>
              <span class="hide-mobile flag-name">{{ props.option.localeName }}</span>
            </template>
        </multiselect>
      </div>
    </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LocaleHelper from '@/utils/LocaleHelper'
import { LocaleData } from '@/interfaces/UserInterfaces'
import { Locale } from '@/interfaces/Locale'
import { EventBus } from '@/main'

@Component({ name: 'LangSwitcher' })
export default class LangSwitcher extends Vue {
  currentLocale: Locale | null = { locale: '', localeName: '' }
  availableLocales: LocaleData[] = []

  created () {
    EventBus.$on('languageChanged', (changedLanguage: string) => {
      if (!LocaleHelper.getDefaultLocale()) {
        const locale = this.availableLocales.find(lang => lang.locale === changedLanguage) || this.availableLocales.find(lang => lang.locale === 'en_GB')

        if (locale && this.currentLocale && locale.locale !== this.currentLocale.locale) {
          this.changeLocale(locale)
        }
      }
    })

    let locale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en_GB'
    this.availableLocales = LocaleHelper.availableLocalesData
    locale = LocaleHelper.getUserLocale()
    this.currentLocale = this.availableLocales.find(lang => lang.locale === locale) || null
  }

  changeLocaleSwitcher (locale: Locale) {
    LocaleHelper.setDefaultLocale(locale.locale)
    this.changeLocale(locale)
  }

  private changeLocale (locale: Locale) {
    this.currentLocale = locale
    LocaleHelper.setUserLocale(this.currentLocale.locale)
    window.location.reload()
  }
}
</script>

<style lang="scss">
  .language {
    width: 200px;
    .form .form-group:last-child {
      margin-bottom: 0;
    }
    @media only screen and (max-width: 600px) {
      width: 81px;
    }
  }
</style>
