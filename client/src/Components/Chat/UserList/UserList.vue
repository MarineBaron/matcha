<template>
    <b-card no-body :header="title">
      <b-list-group flush>
        <UserItem v-if="users"
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
    }
  },
  created() {
    this.$store.dispatch(USER_USERS_REQUEST)
  },
  computed: {
    ...mapState({
      username: state => state.auth.profile.username,
      users: state => state.user.users.filter(user => user.username !== state.auth.profile.username)
    })
  },
}
</script>
