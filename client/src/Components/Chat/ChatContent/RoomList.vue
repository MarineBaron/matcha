<template>
  <b-container fluid>
    <h3>Chat Rooms</h3>
    <b-row>
      <b-col>
        <RoomItem
          v-for="room in getActiveRooms"
          :key="room.data._id"
          :room="room"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import RoomItem from './RoomItem.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      RoomItem
    },
    computed: {
      ...mapGetters([
        'getActiveRooms'
      ]),
    }
  }
</script>
