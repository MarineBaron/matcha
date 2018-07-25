<template>
    <div :class="classUser" :title="title">
        <b-link :to="{path: '/user/' + user.username}">
        {{user.username}}
        </b-link>
            <user-avatar v-if="user.avatar"
              :avatar="user.avatar"
              width="500"
            />
            <user-avatar v-else
              :avatar="defaultAvatar"
              width="500"
            />

        <user-connexion :connexion="connexion" icon="icon" :nodisplay="true" @change-connexion="changeConnexion"/>
    </div>

</template>

<script>
  import UserAvatar from './UserAvatar.vue'
  import UserConnexion from './UserConnexion.vue'
  import moment from 'moment'
  export default {
    components: {
      UserAvatar,
      UserConnexion,
    },
    props: ['user'],
    data() {
      return {
        defaultAvatar: {
          image: {
            name: '00.jpg'
          },
          alt: 'Pas d\'avatar'
        },
        classUser: {
          'user-large': true,
          'text-center': true,
          'connected': false
        },
        title: ''
      }
    },
    mounted(){
      this.setTitle()
    },
    computed: {
      connexion() {
        return {
          username: this.user.username,
          last_logout: this.user.last_logout
        }
      }
    },
    methods: {
      changeConnexion(isConnected) {
        this.classUser.connected = isConnected
        this.setTitle()
      },
      setTitle() {
        this.title = this.classUser.connected ? 'Connecté' : ('Dernière connexion: ' + moment(this.user.last_logout).format("DD/MM/YY HH:mm"))
      }
    }
  }
</script>

<style scoped>
  .user-large {
    width: 100%;
    margin: 5px;
    padding: 5px;
    border-radius: 4px;
    background-color: #eee;
  }
  .user-large .user-avatar {
    border: 3px solid gray;
  }
  .user-large.connected .user-avatar {
    border: 3px solid green;
  }
</style>
