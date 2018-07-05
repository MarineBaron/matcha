<template>
  <div role="tablist">
    <h3>{{title}}</h3>
    <b-card v-if="relations.friends && relations.friends.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab" >
        <b-btn block href="#" v-b-toggle.accordion_friends variant="info" >{{relationsTitle.friends}}</b-btn>
      </b-card-header>
      <b-collapse id="accordion_friends" accordion="my-accordion" role="tabpanel" @shown="askConnexion('friends')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relations.friends"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['view', 'unlike', 'chat']"
          />
          <user-relation-items v-else :users="relations.friends" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relations.likes && relations.likes.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_likes variant="info">{{relationsTitle.likes}}</b-btn>
      </b-card-header>
      <b-collapse id="accordion_likes" accordion="my-accordion" role="tabpanel"  @shown="askConnexion('likes')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relations.likes"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['view', 'unlike']"
          />
          <user-relation-items :users="relations.likes" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relations.likers && relations.likers.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_likers variant="info">{{relationsTitle.likers}}t</b-btn>
      </b-card-header>
      <b-collapse id="accordion_likers" accordion="my-accordion" role="tabpanel" @shown="askConnexion('flikers')">
        <b-card-body>
          <user-list-item v-if="relationStatus.isUser === true"
            v-for="user in relations.likers"
            :key="user.username"
            :item="user"
            :actor="actor"
            :actions="['view', 'like']"
          />
          <user-relation-items :users="relations.likers" />
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
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
        relationsTitle: {
          friends: this.relationStatus.isUser ? "Nous nous aimons" : "Ils s'aiment",
          likes: this.relationStatus.isUser ? "Je les aime" : "Il les aime",
          likers: this.relationStatus.isUser ? "Ils m'aiment" : "Ils l'aiment",
        }
      })
    },
    methods: {
      askConnexion(type) {
        this.relations[type].forEach(u => this.$socket.emit('IS_CONNECTED_REQUEST', u.username))
      }
    }
  }
</script>