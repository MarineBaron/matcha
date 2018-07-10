<template>
  <div class="chat-room-content">
    <MessageMore :room="room" />
    <MessageList :messages="messages" class="chat-room-messages"/>
    <MessageInput :room="room" class="chat-room-input" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MessageMore from './MessageMore.vue'
  import MessageList from './MessageList.vue'
  import MessageInput from './MessageInput.vue'

  export default {
    props: ['room'],
    components: {
      MessageMore,
      MessageList,
      MessageInput
    },
    mounted() {
      var elem = this.$el
      elem.scrollTop = elem.scrollHeight
    },
    updated() {
      var elem = this.$el
      elem.scrollTop = elem.scrollHeight
    },
    computed: {
      ...mapGetters([
        'getMessagesByRoom'
      ]),
      messages() {
        return this.getMessagesByRoom(this.room.data._id)
      }
    }
  }
</script>

<style>
  .chat-room-content {
    height: 500px;
    overflow-y: scroll;
  }
  .chat-room-messages,
  .chat-room-input {
    margin: 20px;
    padding: 10px;
  }
  .chat-room-messages {
    /*background-color: #eee;*/
  }
</style>
