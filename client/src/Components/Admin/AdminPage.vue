<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        <user-list-container />
      </b-col>
      <b-col cols="4">
        <admin-menu />
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
    }
  }
</script>