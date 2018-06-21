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
  import { CHAT_CLOSEROOM } from '../../../Store/chat/mutation-types'

  export default {
    props: {
      room: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        title: 'Chat with ' + this.room.otheruser,
        messages: []
      }
    },
    mounted() {
      this.$socket.on('CHAT_OPENROOM', (username) => {
        console.log('CHAT_OPENROOM')
        const message = username === this.username
          ? 'Bienvenue ' + username + ' !'
          : username + ' rejoint le chat.'
          this.messages = [...this.messages, {username: 'server', message: message}]
      })
      this.$socket.on('CHAT_QUITROOM', (username) => {
        console.log('CHAT_QUITROOM')
        const message = username === this.username
          ? 'Au revoir ' + username + ' !'
          : username + ' quitte le chat.'
          this.messages = [...this.messages, {username: 'server', message: message}]
      })
    },
    methods: {
      closeRoom(e) {
        this.$store.dispatch(CHAT_CLOSEROOM, this.room)
        .then((response) => {
          this.$socket.emit('CHAT_QUITROOM', response, this.username)
        }, (error) => {
          console.log(error)
        })
      }
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username,
      })
    },
  }
</script>
