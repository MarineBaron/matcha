<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      Actions
    </b-card-header>
    <b-list-group>
      <b-list-group-item button @click.prevent="deleteBots">Supprimer Bots</b-list-group-item>
      <b-list-group-item button @click.prevent="createBots">Créer Bots</b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import callApi from '../../../Api/callApi'
  export default {
    methods: {
      createBots() {
        callApi({url: '/admin/createbots'})
        .then((resp) => {
          console.log('RESP', resp)
        }, (err) => {
          console.log('ERR', err)
        })
      },
      deleteBots() {
        callApi({url: '/admin/deletebots'})
        .then((resp) => {
          console.log('RESP', resp)
        }, (err) => {
          console.log('ERR', err)
        })
      }
    }
  }
</script>