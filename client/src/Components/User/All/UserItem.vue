<template>
  <div class="text-center">
    <b-link :to="{path: '/user/' + user.username}">
      <user-avatar v-if="user.avatar"
        :avatar="user.avatar"
      />
      <user-avatar v-else
        :avatar="defaultAvatar"
      />
    </b-link>
    <br/>
    <b-link :to="{path: '/user/' + user.username}">
      {{user.username}}
    </b-link>
  </div>
</template>

<script>
  import UserAvatar from './UserAvatar.vue'
  export default {
    components: {
      UserAvatar
    },
    props: ['user'],
    data(){
      return {
        defaultAvatar: {
          image: {
            name: '00.jpg'
          },
          alt: "Pas d'Avatar"
        }
      }
    }
  }
</script>
