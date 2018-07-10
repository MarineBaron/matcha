<template>
  <div v-if="display" class="text-center">
    <b-button variant="primary" @click="moreMessages">
      Plus de messages
    </b-button>
</div>
</template>

<script>
import { CHAT_MORE_REQUEST } from '../../../Store/chat/mutation-types'
export default {
  props: ['room'],
  data() {
    return({
      display: true
    })
  },
  methods: {
    moreMessages() {
      this.$store.dispatch('CHAT_MORE_REQUEST', this.room)
      .then((resp) => {
        if (!resp.length) {
          this.display = false
        }
      }, (err) => {
        console.log(err)
      })
    }
  }
}
</script>