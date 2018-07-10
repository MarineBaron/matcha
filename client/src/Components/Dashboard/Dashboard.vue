<template>
  <div class="dropdown float-right" v-bind:class="{ open }">
    <div class="dashboard-elements">
      <div
        v-for="element in elements"
        :key="element.name"
        class="dashboard-element"
        :title="element.title"
      >
        <button
          class="btn btn-link"
          @click.prevent="changeType(element.name)"
        >
          <icon :name="element.icon" scale="1.3" color="element.color"></icon>
        </button>
        <span v-if="element.value !== 0" class="badge badge-light">{{element.value}}</span>
      </div>
    </div>
    <div ref="menu" class="dropdown-menu" >
      <b-dropdown-header class="clearfix">
        <div class="d-flex justify-content-between">
          <h5>{{title}}</h5>
          <b-link @click.prevent="close">
            <icon name="times"></icon>
          </b-link>
        </div>
        <div v-if="type === 'notifications'">
          <b-link @click="deleteAll">Tout supprimer</b-link>
        </div>
      </b-dropdown-header>
      <dashboard-item-notif v-if="type === 'notifications'"
        class="dashboard-item"
        v-for="item in items"
        :key="item._id"
        :item="item" />
      <user-list-item v-if="type === 'likes' || type === 'likers' || type === 'friends'"
        class="dashboard-item"
        v-for="item in items"
        :key="item._username"
        :item="item"
        :actions="actions"
        :actor="username"
        @close="close" />
    </div>
  </div>
</template>

<script>
  import DashboardItemNotif from './DashboardItemNotif.vue'
  import UserListItem from '../User/All/UserListItem.vue'
  import { CHAT_ADD_MESSAGE, CHAT_CLOSE_ROOM, CHAT_NEW_MESSAGE } from '../../Store/chat/mutation-types'
  import { AUTH_VISITADD, AUTH_RELATION_OTHER } from '../../Store/auth/mutation-types'
  import { NOTIFICATION_CREATE_REQUEST,  NOTIFICATION_DELETE_REQUEST, NOTIFICATION_DELETEALL_REQUEST} from '../../Store/notification/mutation-types'
  import { mapState } from 'vuex'

  export default {
    components: {
      DashboardItemNotif,
      UserListItem
    },
    data() {
      return ({
        type: '',
        open: false,
      })
    },
    methods: {
      changeType(type) {
        const element = this.elements.find(e => e.name === type)
        if (type !== 'visits' && element.value !== 0) {
          if (this.type === type) {
            this.open = !this.open
          } else {
            this.open = true
          }
          this.type = type
        }
      },
      close(type) {
        this.open = false
      },
      deleteAll() {
        this.$store.dispatch('NOTIFICATION_DELETEALL_REQUEST', this.username)
        .then((resp, err) => {
          this.open = false
        })
      }
    },
    computed: {
      elements() {
        return [
          {
            name: 'notifications',
            color: '',
            title: 'Notifications',
            icon: 'bell',
            value: this.notifications.length,
            items: this.notifications
          },
          {
            name: 'visits',
            color: '',
            title: 'Visites',
            icon: 'eye',
            value: this.visits,
            items: []
          },
          {
            name: 'likes',
            color: '',
            title: 'Je les aime !',
            icon: 'heart',
            value: this.likes.length,
            items: this.likes,
            actions: ['view', 'unlike']
          },
          {
            name: 'likers',
            color: '',
            title: "Ils m'aiment !",
            icon: 'heart',
            value: this.likers.length,
            items: this.likers,
            actions: ['view', 'like']
          },
          {
            name: 'friends',
            color: '',
            title: 'Nous nous aimons',
            icon: 'user',
            value: this.friends.length,
            items: this.friends,
            actions: ['view', 'chat', 'unlike']
          },
        ]
      },
      title() {
          return this.type === ''
            ? ''
            : this.elements.find(e => e.name === this.type).title
      },
      items() {
        return this.type === ''
        ? []
        : this.elements.find(e => e.name === this.type).items
      },
      actions() {
        return this.type === ''
        ? []
        : this.elements.find(e => e.name === this.type).actions
      },
      ...mapState({
        notifications: state => state.auth.profile.notifications ? state.auth.profile.notifications : [],
        friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
        likers: state => state.auth.profile.likers ? state.auth.profile.likers : [],
        likes: state => state.auth.profile.likes ? state.auth.profile.likes : [],
        visits: state => state.auth.profile.visited ? state.auth.profile.visited : 0,
        rooms: state => state.chat.rooms ? state.chat.rooms : [],
        username: state => state.auth.profile ? state.auth.profile.username : ''
      })
    },
    sockets: {
      // reception d'un message
      CHAT_RECEIVE_MESSAGE: function(data) {
        const {room, username, message} = data
        const newMessage = {
          username: username,
          message : message
        }
        this.$store.dispatch(CHAT_ADD_MESSAGE, {id: room, message: newMessage})
      },
      // visite de ma page par un utilisateur
      AUTH_VISITADD: function() {
        this.$store.commit(AUTH_VISITADD)
      },
      // réecption d'une action de relation
      AUTH_RELATION: function(data) {
        if (data.actor.username === this.username) {
          this.$socket.emit('IS_CONNECTED_REQUEST', data.receptor.username)
        }
        if (data.receptor.username === this.username) {
          this.$socket.emit('IS_CONNECTED_REQUEST', data.actor.username)
        }
        this.$store.commit(AUTH_RELATION_OTHER, data)
        if (data.action === 'unlike') {
          if (this.rooms.find(r => r.otheruser === data.actor.username)) {
            this.$store.commit(CHAT_CLOSE_ROOM, data.actor.username)
          }
          if (this.rooms.find(r => r.otheruser === data.receptor.username)) {
            this.$store.commit(CHAT_CLOSE_ROOM, data.receptor.username)
          }
        }
      },
      // réception d'une nouvelle notification
      NOTIFICATION_RECEIVE: function(data) {
        // si le message est une alerte de chat
        if (data.type
          && data.type === 'chat'
          && this.rooms.length) {
            const room = this.rooms.find(r => r.data._id === data.room)
            // si la room existe
            if (room) {
              this.$store.dispatch('NOTIFICATION_DELETE_REQUEST', data._id)
            // sinon, on ajoute la notification à la liste des notifications
            } else {
              this.$store.commit('AUTH_NOTIFICATION_INSERT', data)
            }
            // si la room est closed, on prévient qu'il y a un nouveau message
            if (room && room.status === 'closed') {
              this.$store.commit('CHAT_NEW_MESSAGE', data.room)
            }
        // sinon, on ajoute la notification à la liste des notifications
        } else {
          this.$store.commit('AUTH_NOTIFICATION_INSERT', data)
        }
      }
    }
  }
</script>

<style>
.dropdown {
  background: #bbb;
}

.dashboard-elements {
  display: flex;
}
.dashboard-elements .badge-light{
   position:relative;
   transform: translate(-100%, -100%)
}

.dropdown-menu {
  width: 100%;
  padding: 0;
}
.dropdown.open .dropdown-menu {
  display: block;
}

.dropdown-header {
  margin-top: 0;
  padding: 10px;
  background-color: #999;
  color: white;
}

.dashboard-item {
  padding: 10px;
  border-top: 1px solid #999;
}


</style>
