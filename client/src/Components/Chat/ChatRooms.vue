<template>
  <div>
  <room-item v-for="(room, index) in rooms"
    :key="room.otheruser"
    :room="room"
    :otheruser="getOtherUser(room)"
    :name="getName(room)"
    :zIndex="zIndex + index"
  />
</div>
</template>

<script>
import { mapState } from 'vuex'
import RoomItem from './RoomItem.vue'
export default {
  components: {
    RoomItem
  },
  data() {
    return ({
      clickToClose: false,
      zIndex: 1000,
    })
  },
  methods: {
    getName(room) {
      return 'chat_' + room.otheruser
    },
    getOtherUser(room) {
      return this.friends.find(u => u.username === room.otheruser)
    },
  },
  computed: {
    ...mapState({
      rooms: state => state.chat.rooms ? state.chat.rooms : [],
      friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
    }),
  }
}
</script>