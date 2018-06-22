<template>
  <b-card
    :header="title"
  >
  <div>
      <p v-for="message in messages">
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
      },
      messages: {
        type: Array
      }
    },
    data() {
      return {
        title: 'Chat with ' + this.room.otheruser
      }
    },
    mounted() {
      this.$socket.on('CHAT_OPENROOM', (id, username) => {
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Bienvenue ' + username + ' !'
              : username + ' rejoint le chat.'
          }
          this.$store.dispatch('CHAT_ADDMESSAGE', {id: id, message: message})
        }
      })
      this.$socket.on('CHAT_QUITROOM', (id, username) => {
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Au revoir ' + username + ' !'
              : username + ' quitte le chat.'
          }
          this.$store.dispatch(CHAT_ADDMESSAGE, id, message)
        }
      })
    },
    methods: {
      closeRoom(e) {
        this.$store.dispatch(CHAT_CLOSEROOM, this.room)
        .then((response) => {
          this.$socket.emit('CHAT_QUITROOM', response.data._id)
        }, (error) => {
          console.log(error)
        })
      },
      addMessage(message) {
        //this.messages.push(message)
      }
    },
    computed: {
      // messages:  function() {
      //   return this.room.data.messages
      // },
      ...mapState({
        username: state => state.auth.profile.username
      })
    },
  }
</script>
