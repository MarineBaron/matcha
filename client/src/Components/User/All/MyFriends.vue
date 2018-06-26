<template>
    <b-card class="card my-4">
      <b-row class="text-center"
      >
        <b-col>
        <h5>{{ title }} {{ username.toUpperCase() }}</h5>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col md="6" class="p-4" v-for="user in users" :key="user.username">
          <b-link :to="{path: '/user/' + user.username}" title="">
          {{user.username}}   </b-link>
          <b-img v-if="user.avatar.image" :src="'http://localhost:5000/images/' + user.avatar.image.name" fluid alt="user.avatar" />
        </b-col>
      </b-row>
    </b-card>

</template>
<script>
  import { USER_FRIENDS_REQUEST } from '../../../Store/user/mutation-types'
  import { mapGetters, mapState } from 'vuex'

  export default {
    components: {},
    data() {
      return {
        mode: 'view',
        title: 'Les Amis de ',
        users: {},
        error: ''
      }
    },

    methods: {

      onClick(e) {

      }
    },
    computed: {
      ...mapState({
        username: state => `${state.auth.profile.username}`
      })
    },
    mounted() {
         console.log(`(MyFriends.vue L46) Username : ${this.username}`)
      this.$store.dispatch(USER_FRIENDS_REQUEST, this.username)
      .then((response) => {
          console.log('La reponse : ', response)

          this.users = response
          // this.users = []
      }, (error) => {
          // console.log(`L'erreur : ${error}`)
        this.error = "Non non non ! Pascal ! :("
      })
    }
  }
</script>
