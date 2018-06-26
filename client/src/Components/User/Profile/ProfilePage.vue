<template>
   <b-container>
    <h2>{{title}}</h2>
          <b-link @click.prevent="onClick" class="edit">{{buttonText}}</b-link>
      <b-row>
        <b-col sm="8">
          
          <b-container>
            <profile-view v-if="loadingSuccess&&mode=='view'" :user="user" />
            <profile-form v-if="loadingSuccess&&mode=='edit'" :user="user" />
          </b-container>
        </b-col>
        <b-col sm="4">
          <profile-view-interest :user="user"/>
          <my-friends></my-friends>
          </b-col>
    </b-row>
  </b-container>
  
</template>

<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import ProfileView from './ProfileView/ProfileView.vue'
  import ProfileViewInterest from './ProfileView/ProfileViewInterest.vue'
  import ProfileForm from './ProfileForm.vue'
  import MyFriends from '../All/MyFriends.vue'
  // import ProfileViewUserPseudo from './ProfileView/ProfileViewUserPseudo.vue'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      ProfileView,
      MyFriends, 
      ProfileForm,
      ProfileViewInterest
    },
    data() {
      return {
        mode: 'view',
        title: 'Votre Interface',
        buttonText: 'Editer',
        user: {},
        error: ''
      }
    },
    methods: {
      onClick(e) {
        this.mode = this.mode === 'edit' ? 'view' : 'edit'
        this.buttonText = this.mode === 'edit' ? 'Voir' : 'Editer'
      },
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username,
        loadingSuccess: state => state.user.status === 'success' ? true : false,
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
.edit {
  float:right;
  margin-top: -40px;
  line-height: 25px;
}
#barreEdit {
  width: auto;
  background-color: aqua;
  padding: 12px 10px 1px 10px;
  border-radius: 5px;
  


}
</style>
