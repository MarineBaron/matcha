<template>
  <div class="chat-room-content">
    <MessageList :messages="room.data.messages" class="chat-room-messages"/>
    <MessageInput :room="room" class="chat-room-input" />
  </div>
</template>

<script>
  import MessageList from './MessageList.vue'
  import MessageInput from './MessageInput.vue'

  export default {
    props: ['room'],
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
  .chat-room-messages,
  .chat-room-input {
    margin: 20px;
    padding: 10px;
  }
  .chat-room-messages {
    /*background-color: #eee;*/
  }
</style>
