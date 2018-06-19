<template>
   
    <b-card class="card my-4">
        <h5 class="card-header">{{ title }}</h5>
        <div class="card-body">
            <b-row>

                <div class="col-sm-4" v-for="user in users">

                   
                    <b-link :to="{path: '/user/' + user.username}" title="">
                    {{user.username}}
                     
                    </b-link> 
                    <b-img src="http://localhost:5000/public/images/00.png" fluid alt="image" />
                </div>
               
            </b-row>
        </div>
    </b-card>
</template>
<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: { },
    data() {
      return {
        mode: 'view',
        title: 'Vos Amis',
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
        console.log(`Username : ${this.username}`)
      //this.$store.dispatch(USER_USER_REQUEST, localStorage.getItem('username'))
      this.$store.dispatch(USER_USER_REQUEST, this.username)
      .then((response) => {
          console.log(`La reponse : ${response['friends']}`)
          this.users = response['friends']
      }, (error) => {
          console.log(`L'erreur : ${error}`)
        this.error = "Non non non ! Pascal ! :("  
      })
    }
  }
</script>