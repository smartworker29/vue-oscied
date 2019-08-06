import Vue from 'vue'
import { Validator } from 'vee-validate'

Vue.mixin({
  methods: {
    localizeValidator: function (localeName: string) : void {
      import(`vee-validate/dist/locale/${localeName}`).then(locale => {
        Validator.localize(localeName, locale)
      })
    }
  }
})
