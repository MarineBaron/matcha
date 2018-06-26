<template>
  <div>
    <b-button @click="$emit('change-type', '')">Fermer</b-button>
    <div>
      DashboardList {{type}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['type']
}
</script>
