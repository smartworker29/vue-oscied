<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>404 - {{ $t('not_found_message') }}</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'NotFoundPage' })
export default class NotFoundPage extends Vue {
}
</script>
