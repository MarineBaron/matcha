<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Nb Users</h3>
          </div>
          <div class="card-body">
            <p>Visiteurs : {{nbVisitors}}</p>
            <p>Connectés : {{nbAuthUsers}}</p>
          </div>
      </div>
  </div>
</template>

<script>

export default {
    data() {
        return {
            nbVisitors: 0,
            nbAuthUsers: 0
        }
    },
    sockets: {
      NBUSERS_CHANGE(data) {
        this.nbVisitors = data.nbVisitors
        this.nbAuthUsers = data.nbAuthUsers
      }
    },
}
</script>

<style>

</style>
