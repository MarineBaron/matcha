<template>
  <b-row>
    <b-col>
      {{user.usermame}}
    </b-col>
    <b-col>
      {{user.visibility}}
    </b-col>
    <b-col>
      <b-button @click.prevent="openChat">Chatter</b-button>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    methods: {
      openChat(e) {
        this.$store.dispatch(CHAT_OPENROOM_REQUEST, [this.username, this.user.username])
        .then((response) => {
          console.log("openChat SUCCESS", response)
        }, (error) => {
          console.log("openChat ERROR", error)
        })
      }
    },
    computed: {
      ...mapState({
        username: `${state.auth.profile.username}`
      })
    }
  }
</script>
