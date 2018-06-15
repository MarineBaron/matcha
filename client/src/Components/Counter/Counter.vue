<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Nb Users</h3>
          </div>
          <div class="card-body">
            <p>Visiteurs : {{nbUsers}}</p>
            <p>Connectés : {{nbConnectedUsers}}</p>
          </div>
      </div>
  </div>
</template>

<script>

export default {
    data() {
        return {
            nbUsers: 0,
            nbConnectedUsers: 0
        }
    },
    sockets: {
      NBUSERS_CHANGE(data) {
        this.nbUsers = data.nbUsers
        this.nbConnectedUsers = data.nbConnectedUsers
      }
    },
}
</script>

<style>

</style>
