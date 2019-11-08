<template>
  <multiselect
    v-model="localModel"
    :searchable="false"
    track-by="locale"
    label="localeName"
    :show-labels="false"
    @select="changeLocale($event)"
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
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import LocaleHelper from '@/utils/LocaleHelper'
import { LocaleData } from '@/interfaces/UserInterfaces'
import { Locale } from '@/interfaces/Locale'

@Component({
})
export default class LanguageSelect extends Vue {
  @Prop({})
  value!: string;

  localModel: LocaleData | null = null;

  @Watch('value')
  onValueChanged () {
    this.localModel = this.availableLocales.find(l => l.locale === this.value) || null
  }

  @Watch('localModel')
  onLocalModelChanged () {
    if (this.localModel && this.localModel.locale !== this.value) {
      this.$emit('input', this.localModel.locale)
    }
  }

  availableLocales: LocaleData[] = []

  created () {
    this.availableLocales = LocaleHelper.availableLocalesData
    this.localModel = this.availableLocales.find(l => l.locale === this.value) || null
  }

  changeLocale (locale: Locale) {
    this.$emit('on-change-locale', locale)
  }
}
</script>
