<template>
  <b-card
    :header="title"
  >
  <div>
      <p v-for="message in room.data.messages">
        <b>{{message.username}} : </b>{{message.message}}
      </p>
  </div>
  <b-button @click.prevent="closeRoom">Quitter</b-button>
  </b-card>
</template>

<script>
  import { mapState } from 'vuex'
  import { CHAT_CLOSEROOM, CHAT_ADDMESSAGE } from '../../../Store/chat/mutation-types'

  export default {
    props: {
      room: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        title: 'Chat with ' + this.room.otheruser
      }
    },
    methods: {
      closeRoom(e) {
        this.$store.dispatch(CHAT_CLOSEROOM, this.room)
        .then((response) => {
          this.$socket.emit('CHAT_QUITROOM', response.data._id)
        }, (error) => {
          console.log(error)
        })
      }
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username
      })
    },
    sockets: {
      CHAT_OPENROOM: function(data) {
        const {id, username} = data
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Bienvenue ' + username + ' !'
              : username + ' rejoint le chat.'
          }
          this.$store.dispatch(CHAT_ADDMESSAGE, {id: id, message: message})
        }
      },
      CHAT_QUITROOM: function(data) {
        const {id, username} = data
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Au revoir ' + username + ' !'
              : username + ' quitte le chat.'
          }
          this.$store.dispatch(CHAT_ADDMESSAGE, {id: id, message: message})
        }
      }
    }
  }
</script>
