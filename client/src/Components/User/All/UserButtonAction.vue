<template>
  <b-button
    @click.prevent="onClick"
  >{{value}}</b-button>
</template>

<script>
  export default {
    props: ['type', 'username'],
    methods: {
      onClick() {
        console.log("onClick: ", this.type, this.username)
      }
    },
    computed: {
      value() {
        switch(this.type) {
          case 'like':
          case 'relike':
            return 'Like'
          break
          case 'unlike':
            return 'Unlike'
          break
          default:
            return 'No action'
          break
        }
      }
    }
  }
</script>
