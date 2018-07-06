<template>
   <b-container fluid v-if="loadingSuccess">
    <h2>{{title}}</h2>
      <b-row>
        <b-col md="8">
          <b-container>
            <profile-view v-if="mode==='view'" :user="user" />
            <profile-form v-if="mode==='edit'" :user="user" />
          </b-container>
        </b-col>
        <b-col md="4">
          <profile-page-actions
            :mode="mode"
            @toggle-mode="toggleMode"
          />
          <profile-view-interest v-if="mode==='view'" :user="user"/>
          <user-relations
            :actor="user.username"
            :relationStatus="relationStatus"
          />
        </b-col>
    </b-row>
  </b-container>

</template>

<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import ProfilePageActions from './ProfilePageActions.vue'
  import ProfileView from './ProfileView/ProfileView.vue'
  import ProfileViewInterest from './ProfileView/ProfileViewInterest.vue'
  import ProfileForm from './ProfileForm/ProfileForm.vue'
  import UserRelations from '../All/UserRelations.vue'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      ProfilePageActions,
      ProfileView,
      ProfileForm,
      ProfileViewInterest,
      UserRelations
    },
    data() {
      return {
        mode: 'view',
        title: 'Votre Interface',
        buttonText: 'Editer',
        error: '',
        relationStatus: {
          isUser: true
        }
      }
    },
    methods: {
      toggleMode(mode) {
        this.mode = (mode === 'edit' ? 'view' : 'edit')
      },
    },
    computed: {
      ...mapState({
        user: state => state.user.user,
        loadingSuccess: state => state.user.status === 'success' ? true : false,
        // relations: state => {
        //   return {
        //     likes: state.auth.profile.likes ? state.auth.profile.likes : [],
        //     likers: state.auth.profile.likers ? state.auth.profile.likers : [],
        //     friends: state.auth.profile.friends ? state.auth.profile.friends : [],
        //   }
        // }
      })
    },
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
