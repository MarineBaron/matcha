<template>
  <div>
    <b-form-textarea
    no-resize
      :rows="3"
      ref="inputMessage"
      v-model="message"
      type="text"
      placeholder="Entrez votre message"
      @keyup.native="checkKeyUp"
      @keydown.native="checkKeyDown"
    />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { CHAT_SEND_MESSAGE_REQUEST } from '../../../Store/chat/mutation-types'
  import { NOTIFICATION_CREATE_REQUEST } from '../../../Store/notification/mutation-types'
  import config from '../../../Config/config'

  export default {
    props: ['room'],
    data() {
      return {
        message: '',
        isMaj: false
      }
    },
    methods: {
      checkKeyDown(e) {
        if (e.keyCode === 16) {
          this.isMaj = true
        }
      },
      checkKeyUp(e) {
        if (e.keyCode === 16) {
          this.isMaj = false
          return
        }
        if(this.message.trim().length && !this.isMaj && e.keyCode === 13) {
          const data = {
            roomId: this.room.data._id,
            otheruser:this.room.otheruser,
            username: this.getProfile.username,
            message: this.message.trim().replace("\n",'<br />')
          }
          this.message = ''
          this.$refs.inputMessage.focus()
          // creation du message en BDD
          this.$store.dispatch(CHAT_SEND_MESSAGE_REQUEST, data)
          .then((response) => {
            // envoi du message via socket
            this.$socket.emit('CHAT_SEND_MESSAGE', response)
            // creation de la notification en BDD
            const notif = {
              username: data.otheruser,
              origin: data.username,
              type: 'chat',
              room: data.roomId,
              message: ' vous a envoyé un message',
            }
            this.$store.dispatch(NOTIFICATION_CREATE_REQUEST, notif)
            .then((response) => {
              // envoi de la notification
              this.$socket.emit('NOTIFICATION_SEND', response)
            }, (error) => {
              console.log('MessageInput.vue ERROR: ', error)
            })
          }, (error) => {
            console.log('MessageInput.vue ERROR: ', error)
          })
        }
      }
    },
    computed: {
      ...mapGetters([
        'getProfile',
      ])
    }
  }
</script>
