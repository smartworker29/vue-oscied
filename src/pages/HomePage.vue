<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <h1>Welcome to ...</h1>
        <p>Wellcome to our surwey</p>
        <p>Please register or sign inif you are a existin user</p>
        <p>{{ testText }}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor esse expedita molestiae neque quod reprehenderit saepe sequi voluptatibus! Accusantium beatae corporis enim omnis provident quas quia quibusdam quod sunt tempora!</p>
      </div>

      <div class="col-4">
        <div class="language">
          <LangSwitcher/>
        </div>
        <div v-if="displayedForm === 'signIn'" class="sign-form">
          <SignInForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
        </div>
        <div v-else-if="displayedForm === 'signUp'" class="sign-form">
          <SignUpForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
        </div>
        <div v-else>
          <p>Other forms</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import UserService from '@/services/UserService'
import SignInForm from '@/components/signIn/SignInForm.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import LangSwitcher from '@/components/common/layout/LangSwitcher.vue'
import store from '@/store'
import { Section, Statement } from '@/interfaces/SurveyInterfaces'

@Component({
  components: {
    SignInForm,
    SignUpForm,
    LangSwitcher
  }
})
export default class Home extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean
  testText: string = 'Static test text'
  displayedForm: string = 'signIn'

  async created () {
    if (this.isAuthenticated) {
      this.testText = await UserService.test()
    }
  }

  changeForm (formName: string) {
    this.displayedForm = formName
  }

  authorizedComplete () {
    if (this.isAuthenticated) {
      this.$router.push({ name: 'survey' })
    }
  }
}
</script>
