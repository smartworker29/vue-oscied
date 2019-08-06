<template>
  <div class="row sign-up-page">
    <div class="offset-md-2 col-md-8">
      <h2>{{ $t('sign_up') }}</h2>
      <SignUpForm/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SignUpForm from '@/components/signUp/SignUpForm.vue'

@Component({
  components: {
    SignUpForm
  }
})
export default class SignUpPage extends Vue {
}
</script>
