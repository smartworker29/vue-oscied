<template>
  <div class="row sign-in-page">
    <div class="offset-md-2 col-md-8">
      <h2>{{ $t('sign_in') }}</h2>
      <SignInForm/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SignInForm from '@/components/signIn/SignInForm.vue'

@Component({
  components: {
    SignInForm
  }
})
export default class SignInPage extends Vue {
}
</script>
