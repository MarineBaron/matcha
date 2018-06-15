<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Nb Users</h3>
          </div>
          <div class="card-body">{{nbUsers}}
          </div>
      </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    data() {
        return {
            nbUsers: 0,
            socket : io('localhost:3001')
        }
    },
    mounted() {
        this.socket.on('NBUSERS_CHANGE', (data) => {
            this.nbUsers = data
            // you can also do this.messages.push(data)
        })
    }
}
</script>

<style>

</style>
