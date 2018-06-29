<template>
  <div class="float-right">
    <div class="d-flex flex-row">
      <dashboard-element v-for="element in elements" :key="element.name" :element="element" @change-type="changeType"/>
    </div>
    <dashboard-list v-if="type" :type="type"  @change-type="changeType"/>
  </div>
</template>

<script>
  import DashboardElement from './DashboardElement.vue'
  import DashboardList from './DashboardList.vue'
  import { AUTH_VISITADD, AUTH_RELATION_SUCCESS } from '../../Store/auth/mutation-types'
  import { mapState } from 'vuex'

  export default {
    components: {
      DashboardElement,
      DashboardList
    },
    data() {
      return ({
        type: ''
      })
    },
    methods: {
      changeType(type) {
        this.type = type
      }
    },
    computed: {
      elements() {
        return [
          {
            name: 'notifications',
            color: 'info',
            title: 'Notifications',
            icon: 'bell',
            value: this.nbNotifications
          },
          {
            name: 'visits',
            color: 'info',
            title: 'Visites',
            icon: 'eye',
            value: this.nbVisited
          },
          {
            name: 'messages',
            color: 'info',
            title: 'Messages',
            icon: 'envelope',
            value: 10
          },
          {
            name: 'likes',
            color: 'info',
            title: 'Je les aime !',
            icon: 'heart',
            value: this.nbLikes
          },
          {
            name: 'likers',
            color: 'info',
            title: "Ils m'aiment !",
            icon: 'heart',
            value: this.nbLikers
          },
          {
            name: 'friends',
            color: 'info',
            title: 'Nous nous aimons',
            icon: 'user',
            value: this.nbFriends
          },
        ]
      },
      ...mapState({
        nbNotifs: state => state.auth.profile.notifications ? state.auth.profile.notifications.length : 0,
        nbFriends: state => state.auth.profile.friends ? state.auth.profile.friends.length : 0,
        nbLikers: state => state.auth.profile.likers ? state.auth.profile.likers.length : 0,
        nbLikes: state => state.auth.profile.likes ? state.auth.profile.likes.length : 0,
        nbVisited: state => state.auth.profile.visited ? state.auth.profile.visited : 0,
      })
    },
    sockets: {
      AUTH_VISITADD: function() {
        this.$store.commit(AUTH_VISITADD)
      },
      AUTH_RELATION: function(data) {
        console.log('recept AUTH_RELATION', data)
        this.$store.commit(AUTH_RELATION_SUCCESS, data)
      },
    }
  }
</script>
