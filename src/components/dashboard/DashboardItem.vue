<template>
  <div class="dashboard-item">
    <p class="dashboard-item-type">{{ $t('dashboard.item_type.' + type) }}</p>
    <p class="dashboard-item-name">{{ title }}</p>
    <p class="dashboard-item-date">
      <template v-if="item.timeCompleted">
        {{ $t('dashboard.completed_on') }} {{ moment(item.timeCompleted).format("DD/MM/Y") }}
      </template>
      <template v-if="item.timeCreated">
        {{ $t('dashboard.started_on') }} {{ moment(item.timeCreated).format("DD/MM/Y") }}
      </template>
    </p>
    <Progress v-if="item.timeCreated"
      :show-title="false"
      :show-percent-inside="false"
      :processed-props-items-count="item.timeCompleted ? 1 : 0"
      :total-props-progress-items-count="1"
      percentage="true"
    />
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DashboardBaseItem } from '@/interfaces'
import Progress from '@/components/common/progressBar/Progress.vue'

@Component({
  components: {
    Progress
  }
})
export default class DashboardItem extends Vue {
  @Prop({
    required: true
  })
  type!: string

  @Prop({
    required: true
  })
  title!: string

  @Prop({
    required: true
  })
  item!: DashboardBaseItem

  moment = moment
}
</script>
