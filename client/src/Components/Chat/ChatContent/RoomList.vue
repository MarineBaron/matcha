<template>
  <b-card-group deck>
  <h2>Rooms</h2>
  <RoomItem
    v-for="room in rooms"
    :key="room.data._id"
    :room="room"
  ></RoomItem>
  </b-card-group>
</template>

<script>
  import RoomItem from './RoomItem.vue'
  import { mapGetters } from 'vuex'
  
  export default {
    components: {
      RoomItem
    },
    computed: {
      // ...mapGetters({
      //   rooms: 'getActiveRooms'
      // }),
      rooms() {
        console.log(this.$store.state.chat.rooms)
        return this.$store.state.chat.rooms
      }
    }
  }
</script>
