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
import Vue from 'vue'
import UserItem from './UserItem.vue'
import { USER_USERS_REQUEST } from '../../../Store/user/mutation-types'
import { mapState } from 'vuex'

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
  created() {
    console.log("MOUNTED")
    this.$store.dispatch(USER_USERS_REQUEST)
    .then((response) => {
      console.log("UsreList mounted",response)
      //this.users = response.filter(user => user.username !== this.username)
      this.users = response[0].filter(user => user.username !== this.username)
    }, (error) => {
      console.log(USER_USERS_REQUEST + ' ECHEC', error)
    })
  },
  computed: {
    ...mapState({
      username: state => `${state.auth.profile.username}`
    })
  }
}
</script>
