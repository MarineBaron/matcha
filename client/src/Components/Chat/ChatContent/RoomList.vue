<template>
  <div>
  <h3>Chat Rooms</h3>
  <b-card-group deck class="mb-3">
    <RoomItem
      v-for="room in getActiveRooms"
      :key="room.data._id"
      :room="room"
    ></RoomItem>
    </b-card-group></div>
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
