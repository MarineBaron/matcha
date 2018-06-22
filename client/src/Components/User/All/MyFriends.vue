<template>
   
    <b-card class="card my-4">
        <h5 class="card-header">{{ title }} {{username.toUpperCase() }}</h5>
        <div class="card-body">
            <b-row>

                <div class="col-sm-4" v-for="user in users">

                    <b-link :to="{path: '/user/' + user.username}" title="">
                    {{user.username}}
                     
                    </b-link> 
                    <b-img v-if="user.avatar.image" :src="'http://localhost:5000/images/' + user.avatar.image.name" fluid alt="user.avatar" />
                </div>
               
            </b-row>
        </div>
    </b-card>
</template>
<script>
  import { USER_FRIENDS_REQUEST } from '../../../Store/user/mutation-types'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: { },
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