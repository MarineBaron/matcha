<template>
    <b-card no-body :header="title">
      <b-list-group flush>
        <UserItem
          v-for="user in users"
          :key="user.username"
          :user="user"
        />
      </b-list-group>
    </b-card>
</template>

<script>
import UserItem from './UserItem.vue'

export default {
  components: {
    UserItem
  },
  data() {
    return {
      title: 'Membres',
      users: []
    }
  },
  mounted: {
    this.$store.dispatch(USER_USERS_REQUEST)
    .then((response) => {
      console.log(USER_USERS_REQUEST + ' SUCCESS', response)
    }, (error) => {
      console.log(USER_USERS_REQUEST + ' ECHEC', error)
    })
  }
}
</script>
