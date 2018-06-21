<template>
  <b-container>
    <b-row>
      <b-col>
        <RoomList />
      </b-col>
      <b-col>
        <UserList />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RoomList from './ChatContent/RoomList.vue'
import UserList from './UserList/UserList.vue'

export default {
    components: {
      RoomList,
      UserList
    }
}
</script>
