<template>
  <div>
    <b>{{message.username}}</b> : {{message.message}}
  </div>
</template>

<script>
  export default {
    props: {
      message: {
        type: Object,
        required: true
      },
    },
  }
</script>