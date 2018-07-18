<template>
  <div class="text-center">
    <b-link :to="{path: '/user/' + user.username}">
      <user-avatar v-if="user.avatar"
        :avatar="user.avatar"
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
  }
</script>
