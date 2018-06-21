<template>
  <b-card 
    :header="title"
  >
  <div>
    <ul>
      <li v-for="message in messages">
        <b>{{message.username}} :</b>{{message.message}}
      </li>
    </ul>
  </div>
  <b-button @click.prevent="closeRoom">Quitter</b-button>
  </b-card>
</template>

<script>
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
          this.messages = [...this.messages, {username: 'server', message: 'Bienvenue ' +  username + ' !'}]
          // you can also do this.messages.push(data)
      })
    },
    methods: {
      closeRoom(e) {
        this.$store.dispatch(CHAT_CLOSEROOM, this.room.otheruser)
      }
    }
  }
</script>
