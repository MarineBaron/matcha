<template>
  <div>
    <b-form-input
      v-model="message"
      type="text"
      placeholder="Entrez votre message"
      @keyup.native="checkKey"
    />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { CHAT_SENDMESSAGE_REQUEST} from '../../../../Store/chat/mutation-types'

  export default {
    props: ['roomId'],
    data() {
      return {
        message: ''
      }
    },
    methods: {
      checkKey(e) {
        if(this.message.trim().length && e.keyCode === 13) {
          const data = {
            roomId: this.roomId,
            username: this.getProfile.username,
            message: this.message.trim()
          }
          this.message = ''
          this.$store.dispatch('CHAT_SENDMESSAGE_REQUEST', data)
          .then((response) => {
            this.$socket.emit('CHAT_SENDMESSAGE', response)
          }, (error) => {
            console.log('MessageInput.vue ERROR', error)
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