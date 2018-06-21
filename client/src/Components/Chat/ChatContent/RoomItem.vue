<template>
  <b-card :header="title">
    <div>
      messages
    </div>
  </b-card>
</template>

<script>
  export default {
    props: {
      room: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        title: 'Chat with ' + this.room.otheruser
      }
    }
  }
</script>
