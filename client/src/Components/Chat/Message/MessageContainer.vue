<template>
  <div class="chat-room-content" ref="messageContainer">
    <MessageList :messages="room.data.messages" />
    <MessageInput :room="room" />
  </div>
</template>

<script>
  import MessageList from './MessageList.vue'
  import MessageInput from './MessageInput.vue'

  export default {
    props: {
      room: {
        type: Object,
        required: true
      }
    },
    components: {
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
  }
</script>

<style>
  .chat-room-content {
    height: 500px;
    overflow-y: scroll;
  }
</style>
