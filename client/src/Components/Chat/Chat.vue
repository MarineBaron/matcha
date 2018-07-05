<template>
  <RoomList />
</template>

<script>
import RoomList from './ChatContent/RoomList.vue'
import { CHAT_WATCH_ALLROOMS, CHAT_UNWATCH_ALLROOMS } from '../../Store/chat/mutation-types'
import Vue from 'vue'
import store from '../../Store/store.js'
import { mapState, mapGetters } from 'vuex'

export default {
    components: {
      RoomList
    },
    beforeRouteEnter (to, from, next) {
      store.dispatch(CHAT_WATCH_ALLROOMS)
      next()
    },
    beforeRouteLeave (to, from, next) {
      store.dispatch(CHAT_UNWATCH_ALLROOMS)
      next()
    },
    computed: {
      ...mapGetters([
        'isProfileLoaded'
      ]),
      ...mapState({
        success: state => state.room.status === 'success',
        username: state => isProfileLoaded ? state.auth.profile.username : '',
        rooms: state => state.chat.rooms
      })
    }
}
</script>
