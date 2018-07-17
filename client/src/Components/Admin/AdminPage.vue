<template>
  <b-container fluid>
    <h2>Gestion des utilisateurs</h2>
    <admin-menu :status="status" @delete-bots="deleteBots"  @create-bots="createBots"/>
    <user-list-container :status="status" :items="items" :params="params" :totalRows="totalRows" @change-params="changeParams"  @delete-user="deleteUser"/>
    <map-user-all type="admin" :status="status" :items="items" />
  </b-container>
</template>

<script>
  import callApi from '../../Api/callApi'
  import AdminMenu from './AdminMenu.vue'
  import UserListContainer from './UserListContainer.vue'
  import MapUserAll from '../Map/MapUserAll.vue'

  export default {
    components: {
      AdminMenu,
      UserListContainer,
      MapUserAll
    },
    data() {
      return ({
        status: 'loading',
        items: [],
        totalRows: 0,
        params: {
          perPage: 10,
          currentPage: 1,
          sortBy: 'username',
          sortDesc: false,
          filters: {
            confirmed: null,
            is_completed: null,
            bot: null
          }
        }
      })
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      changeParams(params) {
        this.params = params
        this.fetchData()
      },
      fetchData() {
        this.status = 'loading'
        const data = this.params
        callApi({url: '/admin/users', data, method: 'POST'})
        .then((resp) => {
          this.status = 'success'
          this.items = resp.data.data
          this.totalRows = resp.data.total
        }, (err) => {
          this.status = 'error'
          console.log('ERR', err)
          this.items = []
          this.totalRows = 0
        })
      },
      deleteUser(username) {
        if(this.status === 'success') {
          this.status = 'loading'
          callApi({url: '/admin/delete/' + username})
          .then((resp) => {
            this.fetchData()
          }, (err) => {
            console.log('ERR', err)
          })
        }
      },
      createBots() {
        if(this.status === 'success') {
          this.status = 'loading'
          callApi({url: '/admin/createbots'})
          .then((resp) => {
            this.fetchData()
          }, (err) => {
            console.log('ERR', err)
          })
        }
      },
      deleteBots() {
        if(this.status === 'success') {
          this.status = 'loading'
          callApi({url: '/admin/deletebots'})
          .then((resp) => {
            this.fetchData()
          }, (err) => {
            console.log('ERR', err)
          })
        }
      },
    },
  }
</script>