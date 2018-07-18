<template>
  <b-container>
    <b-row>
      <b-col v-for="user in users" :key="user.username"
        cols="4"
        class="text-center"
      >
        <user-item :user="user" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import UserItem from './UserItem.vue'
  export default {
    components: {
      UserItem
    },
    props: ['users'],
  }
</script>
