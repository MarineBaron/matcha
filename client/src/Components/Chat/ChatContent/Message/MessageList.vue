<template>
  <div>
    <MessageItem
      v-for="{username, message, index} in messages"
      :key="index"
      :message="{username: username, message: message}"
    />
  </div>
</template>

<script>
  import MessageItem from './MessageItem.vue'

  export default {
    props: ['messages'],
    components: {
      MessageItem
    }
  }
</script>