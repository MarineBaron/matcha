<template>
  <div>
    <profile-view-field-group-interets v-for="(group, index) in groups" :key="index" :group="group" />
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import ProfileViewFieldGroupInterets from './ProfileViewFieldGroupInterets.vue'
  import UserRelationItems from '../../All/UserRelationItems.vue'
  import UserListItem from '../../All/UserListItem.vue'

  export default {
    props: ['user'],
    components: {
      ProfileViewFieldGroupInterets,
      UserRelationItems,
      UserListItem
    },
    data() {
      return ({
        isUser: false
      })
    },
    computed: {
      groups() {
        let groups = []

        groups = this.addGroup(groups,
          'Intérêts :', [
          {field: 'gender', name: this.isUser ? 'Vous êtes' : "Il est"},
          {field: 'orientation', name: this.isUser ? 'Vous recherchez' : "Il recherche"},
          {field: 'interests', name: this.isUser ? 'Vos intérêts' : "Ses intérêts"},
        ])
      return groups
      },
      ...mapGetters([
        'isAuthenticated',
        'getUsername'
      ])
    },
    methods: {
      addGroup(groups, title, fields) {
        fields.forEach(f => {
          if (this.user[f.field]) {
            if (Array.isArray(this.user[f.field])) {
              f.value = this.user[f.field].map(v => v.name).join(', ')
            } else {
              f.value = this.user[f.field].name
            }
          }
        })
        groups.push({
          title: title,
          fields: fields.filter(f => f.value)
        })
        return groups
      }
    },
      // ...mapState({
      //   Toto: state => state.auth.profile.username ? state.auth.profile.username : [],
      // }),
    mounted() {
     
      this.isUser = this.user.username === this.getUsername ? true : false
    }
  }
</script>
