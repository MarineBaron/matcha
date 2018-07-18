<template>
  <b-container fluid>
    <h2>Accueil</h2>
    <b-row>
      <b-col md="8">
        <map-user-all
        type="home"
        status="success"
        :user="user"
        />
      </b-col>
      <b-col md="4">
        <user-relations
          :relationStatus="relationStatus"
          :relations="relations"
          :actor="user.username"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import UserRelations from '../User/All/UserRelations.vue'
  import MapUserAll from '../Map/MapUserAll.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      UserRelations,
      MapUserAll
    },
    computed: {
      ...mapState({
        likes: state => state.auth.profile.likes,
        likers: state => state.auth.profile.likers,
        friends: state => state.auth.profile.friends,
        user: state => state.auth.profile
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
