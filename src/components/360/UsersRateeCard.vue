<template>
  <div class="ratee-card users-ratee-card">
    <div class="ratee-image">
      <img
        class="account-image"
        :src="
          (userRatee.image && userRatee.image.fileURL) ||
            require('@/assets/user.png')
        "
      />
    </div>
    <div class="ratee-name">
      <div class="name">{{ userRatee.fullName }}</div>
      <div class="email">{{ userRatee.email }}</div>
    </div>
    <div class="info"></div>
    <div class="actions">
      <button
        class="btn btn-primary btn-primary-active"
        @click="score"
        v-if="hasViewMyScore"
      >
        {{ $t("button_g.view_my_score") }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { TsRateeUser } from '@/interfaces'

@Component({
  name: 'UsersRateeCard'
})
export default class UsersRateeCard extends Vue {
  @Prop({ required: true })
  userRatee!: TsRateeUser;

  @Prop({ required: true, default: false })
  hasViewMyScore!: boolean;

  @Emit()
  score () {}
}
</script>
