<template>
    
    <div class="text-center">
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
        
        <user-connexion :connexion="connexion" icon="icon" />
    </div>
 
</template>

<script>
  import UserAvatar from './UserAvatar.vue'
  import UserConnexion from './UserConnexion.vue'
  export default {
    components: {
      UserAvatar,
      UserConnexion
    },
    props: ['user'],
    data() {
        return {
            defaultAvatar: {
                image: {
                    name: '00.jpg'
                },
                alt: 'Pas d\'avatar'
            }
        }
    },
    computed: {
        connexion() {
            return {
                username: this.user.username,
                last_logout: this.user.last_logout
            }
        }
    }
  }
</script>

<style scoped>
    .img-large {
        padding: .5vw;
    }
    .text-center{    
    padding: .7em;
    margin: 1vh;

    }
</style>
