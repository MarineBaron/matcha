<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        <user-list-container :status="status" @change-status="changeStatus" @change-refresh="changeRefresh"  :refresh="refresh"/>
      </b-col>
      <b-col cols="4">
        <admin-menu :status="status" @change-status="changeStatus" @change-refresh="changeRefresh"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AdminMenu from './Menu/AdminMenu.vue'
  import UserListContainer from './Content/UserListContainer.vue'
  export default {
    components: {
      AdminMenu,
      UserListContainer
    },
    data() {
      return ({
        status: 'loading',
        refresh: true
      })
    },
    methods: {
      changeStatus(status) {
        this.status = status
      },
      changeRefresh(refresh) {
        this.refresh = refresh
      },
    }
  }
</script>