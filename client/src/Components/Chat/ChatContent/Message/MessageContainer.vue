<template>
  <div>
    <MessageList :messages="room.data.messages" />
    <MessageInput :roomId="room.data._id" />
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
    }
  }
</script>