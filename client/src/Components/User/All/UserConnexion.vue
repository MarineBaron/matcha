<template>
  <p class="p-connexion" v-if="!icon">
    <span v-if="isConnected">Connecté</span>
    <span v-else>Dernière connexion : {{connexion.last_logout | moment("DD/MM/YY HH:mm")}}</span>
  </p>
  <span v-else :title="isConnected ? 'Connecté' : 'Déconnecté'">
    <icon v-if="isConnected" name="user" :scale="scale ? scale : 1" color="green"/>
    <icon v-else name="user" :scale="scale ? scale : 1" color="red" />
  </span>
</template>

<script>
  export default {
    props: ['connexion', 'icon', 'scale', 'color'],
    data() {
      return ({
        isConnected: null
      })
    },
    mounted() {
      this.$socket.emit('IS_CONNECTED_REQUEST', this.connexion.username)
    },
    sockets: {
      IS_CONNECTED_RESPONSE: function(data) {
        if (data.username === this.connexion.username) {
          this.isConnected = data.isConnected
        }
      }
    }
  }
</script>