<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      Actions
    </b-card-header>
    <b-list-group>
      <b-list-group-item button :disabled="status !== 'success'" @click.prevent="deleteBots">Supprimer Bots</b-list-group-item>
      <b-list-group-item button :disabled="status !== 'success'" @click.prevent="createBots">Créer Bots</b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import callApi from '../../../Api/callApi'
  export default {
    props: ['status'],
    methods: {
      createBots() {
        this.$emit('change-status', 'loading')
        callApi({url: '/admin/createbots'})
        .then((resp) => {
          this.$emit('change-refresh', true)
        }, (err) => {
          this.$emit('change-status', 'error')
        })
      },
      deleteBots() {
        this.$emit('change-status', 'loading')
        callApi({url: '/admin/deletebots'})
        .then((resp) => {
          this.$emit('change-refresh', true)
        }, (err) => {
          this.$emit('change-status', 'error')
        })
      }
    }
  }
</script>