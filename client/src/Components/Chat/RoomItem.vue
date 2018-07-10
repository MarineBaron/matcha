<template>
  <modal :name="name"
    draggable
    :clickToClose="clickToClose"
    height="auto"
    v-bind:style="{zIndex: zIndex}"
  >
  <b-card no-body @click="toFront">
      <header class="card-header d-flex justify-content-between">
        <h3>Chat</h3>
        <div>
          <user-list-item :item="otheruser" />
        </div>
        <div>
          <b-button variant="link"
            :title="isOtherUserActive ? 'Connecté au chat' : 'Déconnecté du chat'">
            <icon name="comments"
              :color="isOtherUserActive ? 'green' : 'red'"
            />
          </b-button>
          <b-button v-if="room.new" variant="link"
            title="Message(s) non lu(s)">
            <icon name="envelope"
              color="red"
            />
          </b-button>
        </div>
        <div>
        <b-button variant="link"
          :title="collapseTitle"
          v-b-toggle="'roommessage_' + room.otheruser"
          @click.prevent.stop="toggleCollapse"
        ><icon :name="room.status === 'actived' ? 'minus-square' : 'plus-square'" /></b-button>
        <b-button variant="link"
          title="Fermer"
          @click.stop="closeRoom"
        ><icon name="times" /></b-button>
      </div>
      </header>
      <b-collapse :visible="room.status === 'actived'" :id="'roommessage_' + room.otheruser">
        <MessageContainer :room="room" />
      </b-collapse>
  </b-card>
  </modal>
</template>

<script>
  import { mapState } from 'vuex'
  import { CHAT_CLOSE_ROOM, CHAT_ADD_MESSAGE, CHAT_TOFRONT_ROOM, CHAT_TOGGLE_ROOM } from '../../Store/chat/mutation-types'
  import UserListItem from '../User/All/UserListItem.vue'
  import MessageContainer from './Message/MessageContainer.vue'

  export default {
    components: {
      UserListItem,
      MessageContainer
    },
    props: ['name', 'room','otheruser','zIndex'],
    data() {
      return {
        collapseTitle: this.room.status === 'actived' ? 'Masquer' : 'Afficher',
        clickToClose: false,
        isOtherUserActive: false
      }
    },
    methods: {
      closeRoom(e) {
        this.$modal.hide('chat_' + this.room.otheruser)
        this.$store.dispatch(CHAT_CLOSE_ROOM, this.room)
        .then((response) => {
          this.$socket.emit('CHAT_QUIT_ROOM', response.data._id)
        }, (error) => {
          console.log(error)
        })
      },
      toggleCollapse() {
        this.$store.commit(CHAT_TOGGLE_ROOM, this.room)
      },
      toFront() {
        this.$store.commit(CHAT_TOFRONT_ROOM, this.room)
      }
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username
      })
    },
    sockets: {
      CHAT_OPEN_ROOM: function(data) {
        const {id, username} = data
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Bienvenue ' + username + ' !'
              : username + ' rejoint le chat.'
          }
          // etat de l'autre utilisateur
          if (username === this.username) {
            this.isOtherUserActive = data.isOtherUserActive
          } else {
            this.isOtherUserActive = true
          }
          this.$store.dispatch(CHAT_ADD_MESSAGE, {id: id, message: message})
        }
      },
      CHAT_QUIT_ROOM: function(data) {
        const {id, username} = data
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Au revoir ' + username + ' !'
              : username + ' quitte le chat.'
          }
          // etat de l'autre utilisateur
          this.isOtherUserActive = data.isOtherUserActive
          this.$store.dispatch(CHAT_ADD_MESSAGE, {id: id, message: message})
        }
      }
    }
  }
</script>
