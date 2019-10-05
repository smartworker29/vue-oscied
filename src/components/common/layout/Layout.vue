<template>
  <div class="application-wrapper">
    <template v-if="isAuthenticated">
      <user-header/>
    </template>
    <div class="content">
      <router-view/>
    </div>
    <app-footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import UserHeader from '@/components/common/layout/UserHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'

@Component({
  components: {
    UserHeader,
    AppFooter
  }
})
export default class Layout extends Vue {
  @Getter('user/isAuthenticated')
  private isAuthenticated!: boolean
}
</script>
