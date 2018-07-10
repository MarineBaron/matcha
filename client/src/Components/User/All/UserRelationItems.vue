<template>
  <b-container>
    <b-row>
      <b-col v-for="user in users" :key="user.username"
        cols="4"
        class="text-center"
      >
        <b-link :to="{path: '/user/' + user.username}">
          <user-avatar v-if="user.avatar"
            :avatar="user.avatar"
          />
        </b-link>
        <br/>
        <b-link :to="{path: '/user/' + user.username}">
          {{user.username}}
        </b-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import UserAvatar from './UserAvatar.vue'
  export default {
    components: {
      UserAvatar
    },
    props: ['users'],
  }
</script>
