<template>
  <div v-if="isAuthenticated">
    content goes here
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'

  @Component({
    components: {
      SignInForm,
      SignUpForm,
      LangSwitcher
    }
  })
export default class DashboardPage extends Vue {
    @Getter('user/isAuthenticated')
    isAuthenticated!: boolean
}
</script>
