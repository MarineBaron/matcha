<template>
  <b-row class="chat-message">
    <b-col cols="10" offset="1" v-if="isServer">
      <div class="is-server">
        {{message.message}}
      </div>
    </b-col>
    <b-col cols="8" v-if="isMe">
      <div class="is-me">
        <h6>{{message.username}}</h6>
        <p v-html="message.message"></p>
      </div>
    </b-col>
    <b-col cols="8" offset="4" v-if="isOther">
      <div class="is-other">
        <h6>{{message.username}}</h6>
        <p v-html="message.message"></p>
      </div>
    </b-col>
</b-row>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  export default {
    props: ['message'],
    computed: {
      isMe() {
        return this.message.username === this.username
      },
      isServer() {
        return this.message.username === 'server'
      },
      isOther() {
        return !this.isMe && !this.isServer
      },
      ...mapState({
        username: state => state.auth.profile.username
      })
    }
  }
</script>

<style>
  .chat-message > div {
    padding: 5px;
    font-size: 12px;
  }
  .chat-message > div > div {
    margin: 5px;
  }

  .chat-message > div > div.is-server {
    text-align: center;
    font-style: italic;
    color: orange;
  }

  .chat-message h6 {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 0;
  }

  .chat-message p {
    border: 1px solid;
    border-radius: 4px;
    padding: 3px;
    background-color: #eee;
  }
  .chat-message .is-me p {
    border-color: indigo;
  }
  .chat-message .is-other p {
    border-color: teal;
  }
  .chat-message .is-me h6 {
    color: indigo;
  }
  .chat-message .is-other h6 {
    color: teal;
  }
</style>