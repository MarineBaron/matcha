<template>
   <div class="container">
    <h2>{{title}}</h2>

         <b-list-group>          
            <b-list-group-item style="background-color: rgba(0, 0, 0, 0);"> 
               <div>{{user.username.toUpperCase()}}</div> 
            </b-list-group-item>
        </b-list-group>

            <div id="InfoRight">
              <b-button variant="primary">
                Notifications <b-badge variant="light">4</b-badge>
              </b-button>
                <b-button class="btn btn-info" title="Visite">
                        <i class="fas fa-eye"></i> <span class="badge badge-light">10</span>
                </b-button>
                <b-button class="btn btn-info" title="Mails en attente">
                    <i class="fa fa-envelope"></i> <span class="badge badge-light">4</span>
                </b-button>
                <b-button class="btn btn-info" title="Coup de Coeur">
                    <i class="fa fa-heart"></i> <span class="badge badge-light">4</span>
                </b-button>
                <b-button class="btn btn-info" title="Amis">
                    <i class="fa fa-user-friends"></i> <span class="badge  badge-light">4</span>
                </b-button>
            </div>
    

          <b-row>
        <b-col cols="12" md="8">

          <b-jumbotron header="Bootstrap Vue" lead="Bootstrap 4 Components for Vue.js 2" >
  <p>For more information visit website</p>
  <b-btn variant="primary" href="#">More Info</b-btn>
</b-jumbotron>

        </b-col>
        <b-col cols="6" md="4"><my-friends></my-friends></b-col>
    </b-row>
  </div>
</template>

<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import ProfileView from './ProfileView.vue'
  import ProfileForm from './ProfileForm.vue'
  import MyFriends from '../All/MyFriends.vue'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      ProfileView,
      MyFriends, 
      ProfileForm
    },
    data() {
      return {
        mode: 'view',
        title: 'Votre Interface',
        buttonText: 'Editer',
        resume: 'toto',
        user: {},
        error: ''
      }
    },
    methods: {

      onClick(e) {
        this.mode = this.mode === 'edit' ? 'view' : 'edit'
        this.buttonText = this.mode === 'edit' ? 'Voir' : 'Editer'
      }
    },
    computed: {
      ...mapState({
        username: state => `${state.auth.profile.username}`
      })
    },
    mounted() {
      //this.$store.dispatch(USER_USER_REQUEST, localStorage.getItem('username'))
      this.$store.dispatch(USER_USER_REQUEST, this.username)
      .then((response) => {
        console.log("USR", response)
        this.user = response
      }, (error) => {
        this.error = "Une erreur est survenue lors de la confirmation de votre inscription."
      })
    }
  }
</script>
<style>
    .breadcrumb-item {
        font-variant-caps:small-caps;
        font-size: 25px;
    }
    div#infos {
        float: right;
        margin-top: -25px;
      }
     #InfoRight  {
          float: right;
          margin-top: -44px;
          margin-right: 4px;
      }

    </style>
