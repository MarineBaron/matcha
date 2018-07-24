<template>
  <div role="tablist">
    <h3>{{title}}</h3>
    <b-card v-if="relationsComputed.friends && relationsComputed.friends.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab" >
        <b-btn block href="#" v-b-toggle.accordion_friends variant="info" >{{relationsTitle.friends}}</b-btn>
      </b-card-header>
      <b-collapse id="accordion_friends" accordion="my-accordion" role="tabpanel" @shown="askConnexion('friends')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relationsComputed.friends"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['unlike', 'chat']"
          />
          <user-relation-items v-else :users="relationsComputed.friends" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relationsComputed.likes && relationsComputed.likes.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_likes variant="info">{{relationsTitle.likes}}</b-btn>
      </b-card-header>
      <b-collapse id="accordion_likes" accordion="my-accordion" role="tabpanel"  @shown="askConnexion('likes')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relationsComputed.likes"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['unlike']"
          />
          <user-relation-items v-else :users="relationsComputed.likes" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relationsComputed.likers && relationsComputed.likers.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_likers variant="info">{{relationsTitle.likers}}</b-btn>
      </b-card-header>
      <b-collapse id="accordion_likers" accordion="my-accordion" role="tabpanel" @shown="askConnexion('likers')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relationsComputed.likers"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['like']"
          />
          <user-relation-items v-else :users="relationsComputed.likers" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relationStatus.isUser === true && relationsComputed.blocked && relationsComputed.blocked.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_blocked variant="info">{{relationsTitle.blocked}}</b-btn>
      </b-card-header>
      <b-collapse id="accordion_blocked" accordion="my-accordion" role="tabpanel" @shown="askConnexion('blocked')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relationsComputed.blocked"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['unblock']"
          />
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import UserRelationItems from './UserRelationItems.vue'
  import UserListItem from './UserListItem.vue'
  export default {
    components: {
      UserRelationItems,
      UserListItem
    },
    props: ['relations', 'relationStatus', 'actor'],
    data() {
      return ({
        title: 'Relations',
      })
    },
    computed: {
      relationsTitle() {
        return {
          friends: this.relationStatus.isUser ? "Nous nous aimons" : "Ils s'aiment",
          likes: this.relationStatus.isUser ? "Je les aime" : "Il les aime",
          likers: this.relationStatus.isUser ? "Ils m'aiment" : "Ils l'aiment",
          blocked: "Je les bloque",
        }
      },
      ...mapGetters([
        'isAuthenticated',
        'getUsername'
      ]),
      ...mapState({
        likes: state => state.auth.profile.likes ? state.auth.profile.likes : [],
        likers: state => state.auth.profile.likers ? state.auth.profile.likers : [],
        friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
        blocked: state => state.auth.profile.blocked ? state.auth.profile.blocked : [],
      }),
      relationsComputed() {
        if (!this.relationStatus.isUser) {
          return this.relations
        }
        return {
          likes: this.likes,
          likers: this.likers,
          friends: this.friends,
          blocked: this.blocked
        }
      }
    },
    methods: {
      askConnexion(type) {
        //this.relationsComputed[type].forEach(u => this.$socket.emit('IS_CONNECTED_REQUEST', u.username))
      }
    }
  }
</script>