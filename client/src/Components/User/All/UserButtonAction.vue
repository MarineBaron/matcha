<template>
  <b-button
    @click.prevent="onClick"
  >{{value}}</b-button>
</template>

<script>
  import { AUTH_RELATION_REQUEST } from '../../../Store/auth/mutation-types'
  import callApi from '../../../Api/callApi'

  export default {
    props: ['type', 'actor', 'receptor'],
    methods: {
      onClick() {
        switch(this.type) {
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
                callApi({url: 'notification/notification', data: {
                  username: data.receptor.username,
                  message: message
                }, method: 'POST'})
                .then((response) => {
                  if (response.data.success) {
                    // envoi du message au recepteur via socket
                    this.$socket.emit('NOTIFICATION_SEND', response.data.data)
                  }
                }, (error) => {
                  console.log("UserButtonAction click Error 1: ", error)
                })

              }
            }, (error) => {
                console.log("UserButtonAction click Error 2: ", error)
            })
          break
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
          case 'like':
            return 'Like'
          break
          case 'unlike':
            return 'Unlike'
          break
          default:
            return 'No action'
          break
        }
      }
    }
  }
</script>
