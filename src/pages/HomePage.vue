<template>
  <div class="container auth-container">
    <div class="row">
      <div class="col-8">
        <img :src="require('@/assets/logo-ccr.svg')" />
        <h1>Welcome</h1>
        <h2>Survey name</h2>
            <!-- <p v-if="!isAuthenticated">{{ $t('please_register') }}</p> -->
            <p>Please register or sign in if you are a existing user</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec enim risus. Mauris efficitur felis lacinia, aliquam mauris a, imperdiet turpis. Morbi fringilla urna eros, at mattis dui sagittis ac. Curabitur eu enim nisl. Nullam ac feugiat sapien. Quisque eu purus ut diam imperdiet viverra sed at nulla. In pharetra hendrerit vestibulum.</p>
            <p>Donec sollicitudin, felis ut posuere aliquam, quam lorem gravida nulla, non tempor dui felis sed magna. Nulla facilisi. Fusce rhoncus faucibus ipsum at blandit. Aenean posuere tellus nec lorem maximus, ut egestas quam varius. Integer vitae nulla consequat, cursus dui non, vestibulum sem. </p>
      </div>
      <div class="col-4" v-if="!isAuthenticated">
        <div class="language">
          <LangSwitcher/>
        </div>
        <div v-if="displayedForm === 'signIn'" class="sign-form">
          <SignInForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
        </div>
        <div v-else-if="displayedForm === 'signUp'" class="sign-form">
          <SignUpForm @changeForm="changeForm" @authorizedComplete="authorizedComplete"/>
        </div>
      </div>
    </div>
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
export default class HomePage extends Vue {
  @Getter('user/isAuthenticated')
  isAuthenticated!: boolean
  displayedForm: string = 'signUp'

  changeForm (formName: string) {
    this.displayedForm = formName
  }

  authorizedComplete () {
    // TODO
  }
}
</script>

<style lang="scss">
  .auth-container {
    min-height: 100vh;
    padding: 50px 80px
  }
</style>
