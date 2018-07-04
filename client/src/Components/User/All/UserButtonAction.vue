<template>
  <b-button variant="link"
    :title="value"
    @click.prevent="onClick"
  ><icon :name="icon" :scale="scale ? scale : 1" /></b-button>
</template>

<script>
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import { CHAT_OPEN_ROOM_REQUEST, CHAT_OPEN_ROOM_SOCKET } from '../../../Store/chat/mutation-types'
  import { AUTH_RELATION_REQUEST } from '../../../Store/auth/mutation-types'
  import { NOTIFICATION_CREATE_REQUEST } from '../../../Store/notification/mutation-types'

  export default {
    props: ['type', 'actor', 'receptor', 'scale'],
    methods: {
      onClick() {
        switch(this.type) {
          case 'view':
            this.$emit('close')
            this.$router.push('/user/' + this.receptor)
          break;
          case 'like':
          case 'unlike':
            // dispatch du like/unlike
            this.$store.dispatch(AUTH_RELATION_REQUEST, this.data)
            .then((response) => {
              if (response.data.success) {
                const data = response.data.data
                // emission de l'info (socket)
                this.$socket.emit('AUTH_RELATION', data)

                // creation d'un message en BDD
                let message = data.actor.username + ' vous a '
                message += (data.action === 'unlike') ? 'unliké.' : 'liké.'
                if (data.action === 'relike') {
                  message += ' Vous êtes amis.'
                }
                const notif = {
                  username: data.receptor.username,
                  type: 'relation',
                  message: message
                }
                this.$store.dispatch(NOTIFICATION_CREATE_REQUEST, notif)
                .then((response) => {
                    this.$socket.emit('NOTIFICATION_SEND', response)
                }, (error) => {
                  console.log("UserButtonAction click Error 1: ", error)
                })

              }
            }, (error) => {
                console.log("UserButtonAction click Error 2: ", error)
            })
          break
          case 'chat':
            this.$store.dispatch(CHAT_OPEN_ROOM_REQUEST, [this.actor, this.receptor])
            .then((response) => {
              this.$socket.emit('CHAT_OPEN_ROOM', {
                usernames: response.usernames,
                room: response.room,
                username: this.actor
              })
              this.$emit('close')
              this.$router.push('/chat')
            }, (error) => {
              console.log("UserListItem.vue chat ERROR", error)
            })
          break;
          default:
            console.log("UserButtonAction onClick: no action")
          break
        }
      }
    },
    computed: {
      data() {
        return {
          action: this.type,
          actor: this.actor,
          receptor: this.receptor
        }
      },
      value() {
        switch(this.type) {
          case 'view':
            return 'Voir'
          break
          case 'like':
            return 'Like'
          break
          case 'unlike':
            return 'Unlike'
          break
          case 'chat':
            return 'Chat'
          break
          default:
            return 'No action'
          break
        }
      },
      icon() {
        switch(this.type) {
          case 'view':
            return 'eye'
          break
          case 'like':
            return 'heart'
          break
          case 'unlike':
            return 'thumbs-down'
          break
          case 'chat':
            return 'comments'
          break
          default:
            return 'No action'
          break
        }
      }
    }
  }
</script>
