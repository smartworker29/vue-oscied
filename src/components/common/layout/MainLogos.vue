<template>
  <div class="survey-logos" v-if="items && items.length > 0">
    <div class="survey-logo" v-for="(logo, index) in items" :key="index">
      <img :src="logo.fileURL">
    </div>
  </div>
  <img v-else class="navbar-logo" :src="require('@/assets/logo-ccr3-blue.svg')" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Image } from '@/interfaces/GeneralInterfaces'

@Component({ name: 'MainLogos' })
export default class MainLogos extends Vue {
  @Getter('mainLogo/getLogos')
  items!: Image[]
}
</script>
