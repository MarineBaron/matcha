<template>
  <b-container fluid>
    <b-row>
      <b-col md="8"><h3> Bienvenue chez... Vous ! ;)</h3>
        <p style="text-align:justify;"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum tempor tortor, ut aliquam lorem condimentum sed. Pellentesque ut est ex. Maecenas consectetur in metus vel pretium. Suspendisse molestie orci quis nisl ornare egestas. Quisque eu ipsum sit amet sem rhoncus rutrum. Aenean ac finibus augue. Sed tempor facilisis orci eu vehicula. In dignissim sapien vitae ex gravida, et mollis dui maximus. Integer vitae quam porttitor orci eleifend dapibus in ac diam. Etiam sagittis odio felis, ultrices porta dui viverra a. Integer ut gravida ipsum. Sed laoreet tempus risus, in egestas arcu efficitur et. Aenean bibendum vulputate mi, eget sodales urna gravida ut. Nam augue odio, dictum quis ipsum non, suscipit feugiat nunc. Duis blandit viverra purus, tincidunt imperdiet lacus tincidunt nec. Duis non consequat diam.
        </p>
        <h2>Carte de vos relations</h2>
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
