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
          <my-friends v-if="user.username" :username="user.username"></my-friends>
          </b-col>
    </b-row>
  </b-container>

</template>

<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import ProfileView from './ProfileView/ProfileView.vue'
  import ProfileViewInterest from './ProfileView/ProfileViewInterest.vue'
  import ProfileForm from './ProfileForm/ProfileForm.vue'
  import MyFriends from '../All/MyFriends.vue'
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
        user: state => state.user.user,
        loadingSuccess: state => state.user.status === 'success' ? true : false,
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
