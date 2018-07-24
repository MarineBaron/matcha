<template>
<b-container fluid>
    <h2>Accueil</h2>
    <div v-if="!users.length">Pas de users</div>
    <b-row  v-else>
        <user-item-large v-for="user in users" :user="user" :key="user.username"/>
    </b-row>
      <b-button v-if="displayMore" @click="searchMore">Autres</b-button>

  </b-container>
</template>

<script>
  import UserItemLarge from '../User/All/UserItemLarge.vue'
  import callApi from '../../Api/callApi'
  export default {
    components: {
      UserItemLarge,
      callApi
    },
    data() {
      return {
        users: [],
        status: '',
        page: 0,
        nbByPage: 9,
        displayMore: true
      }
    },
    mounted(){
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.status = 'loading'
        callApi({url: '/user/users/' + this.nbByPage + '/' + this.page})
        .then((resp) => {
          this.status = 'success'
          if (resp.data.data.length) {
            resp.data.data.map(u => this.users.push(u))
          } else {
            this.displayMore = false
          }
        })
        .catch((err) => {
          this.status = 'error'
          this.users = []
        })
      },
      searchMore() {
        this.page++
        this.fetchData()
      }
    }
  }
</script>