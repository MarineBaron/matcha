<template>
   <div class="container">
    <h2>{{title}}</h2>
         <ol class="breadcrumb">
          
            <li class="breadcrumb-item active"> 
               <div>{{user.username}}</div> 
            </li>
        </ol>
            <div id="InfoRight">
                <button type="button" class="btn btn-info" title="Visite">
                        <i class="fas fa-eye"></i> <span class="badge badge-light">10</span>
                </button>
                <button type="button" class="btn btn-info" title="Mails en attente">
                    <i class="fa fa-envelope"></i> <span class="badge badge-light">4</span>
                </button>
                <button type="button" class="btn btn-info" title="Coup de Coeur">
                    <i class="fa fa-heart"></i> <span class="badge badge-light">4</span>
                </button>
                <button type="button" class="btn btn-info" title="Amis">
                    <i class="fa fa-user-friends"></i> <span class="badge  badge-light">4</span>
                </button>
            </div>
          <div class="row">
     
    
            <!-- Blog Entries Column -->
            <div class="col-md-8">
                

    <!-- <a href="#" @click.prevent="onClick">{{buttonText}}</a> -->
    <my-friends></my-friends>
    
                    </div>
                </div>
    <!-- <profile-view v-bind:mode="mode" v-bind:user="user" v-if="mode==='view'"></profile-view>
    <profile-form v-bind:mode="mode" v-else></profile-form> -->
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
          margin-top: -60px;
      }

    </style>
