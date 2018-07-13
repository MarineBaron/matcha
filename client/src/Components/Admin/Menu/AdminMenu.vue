<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      Actions
    </b-card-header>
    <b-list-group>
      <b-list-group-item button :disabled="status !== 'success'" @click.prevent="$emit('delete-bots')">Supprimer Bots</b-list-group-item>
      <b-list-group-item button :disabled="status !== 'success'" @click.prevent="$emit('create-bots')">Créer Bots</b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import callApi from '../../../Api/callApi'
  export default {
    props: ['status'],
  }
</script>