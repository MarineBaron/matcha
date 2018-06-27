<template>
  <div>UserPage: {{$route.params.username}}</div>
</template>

<script>
  //import { mapState } from 'vuex'
  import callApi from '../../../Api/callApi'
  import Vue from 'vue'

  export default {
    beforeRouteEnter: function(to, from, next) {
      callApi({url: '/user/addvisit/' + to.params.username})
      Vue.prototype.$socket.emit('USER_VISITADD', to.params.username)
      next()
    }
  }
</script>
