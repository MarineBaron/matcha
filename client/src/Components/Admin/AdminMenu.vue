<template>
  <div id="admin-menu">
    <b-button :disabled="status !== 'success'" @click.prevent="$emit('delete-bots')">Supprimer Bots</b-button>
    <b-button :disabled="status !== 'success'" @click.prevent="$emit('create-bots')">Créer Bots</b-button>
  </div>
</template>

<script>
  export default {
    props: ['status'],
  }
</script>

<style scoped>
  #admin-menu {
    text-align: center;
  }
</style>