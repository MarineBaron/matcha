<template>
  <b-list-group-item>
    <dashboard-item-notif v-if="type === 'notifications'" :item="item" />
  </b-list-group-item>
</template>

<script>
  import DashboardItemNotif from './DashboardItemNotif.vue'

  export default {
    components: {
      DashboardItemNotif
    },
    props: ['item', 'type']
  }
</script>
