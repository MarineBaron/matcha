<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        <user-list-container :status="status" :items="items" :params="params" :totalRows="totalRows" @change-params="changeParams"/>
      </b-col>
      <b-col cols="4">
        <admin-menu :status="status"/>
      </b-col>
    </b-row>
    <map-admin username="admin" :status="status" :items="items" />
  </b-container>
</template>

<script>
  import callApi from '../../Api/callApi'
  import AdminMenu from './Menu/AdminMenu.vue'
  import UserListContainer from './Content/UserListContainer.vue'
  import MapAdmin from '../Map/MapAdmin.vue'

  export default {
    components: {
      AdminMenu,
      UserListContainer,
      MapAdmin
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
      deleteUser(id) {
        if(this.status === 'success') {
          this.status = 'loading'
          callApi({url: '/admin/delete/' + id})
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