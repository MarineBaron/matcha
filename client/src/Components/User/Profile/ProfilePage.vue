<template>
   <b-container>
    <h2>{{title}}</h2>
      <b-row>
        <b-col sm="8">
          <b-button @click.prevent="onClick">{{buttonText}}</b-button>
          <profile-view v-if="user&&mode=='view'" :user="user" />
          <profile-form v-if="user&&mode=='edit'" :user="user" />
        </b-col>
        <b-col sm="4"><my-friends></my-friends></b-col>
    </b-row>
  </b-container>

</template>

<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import ProfileView from './ProfileView/ProfileView.vue'
  import ProfileForm from './ProfileForm/ProfileForm.vue'
  import MyFriends from '../All/MyFriends.vue'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      ProfileView,
      MyFriends,
      ProfileForm,
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
