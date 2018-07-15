<template>
  <b-container fluid>
    <h2>Accueil</h2>
    <b-row>
      <b-col md="8">
        Accueil
      </b-col>
      <b-col md="4">
        <user-relations
          :relationStatus="relationStatus"
          :relations="relations"
          :actor="username"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import UserRelations from '../User/All/UserRelations.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      UserRelations
    },
    computed: {
      ...mapState({
        likes: state => state.auth.profile.likes ? state.auth.profile.likes : [],
        likers: state => state.auth.profile.likers ? state.auth.profile.likers : [],
        friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
        username: state => state.auth.profile.username ? state.auth.profile.username : '',
      }),
      relations() {
        return {
          friends: this.friends,
          likes: this.likes,
          likers: this.likers,
        }
      },
      relationStatus() {
        return {
          isLiked: false,
          isLiker: false,
          isFriend: false,
          isUser: true,
        }
      },
    }
  }
</script>
