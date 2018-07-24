<template>
  <div class="user-list-item d-flex justify-content-between">
    <user-item :user="item" /> 
    <div class="user-connected">
      <user-connexion :connexion="connexion" icon="1" />
    </div>
    <div v-if="actions" class="user-actions">
      <user-button-action v-for="action in actions" :key="action"
        :type="action"
        :actor="actor"
        :receptor="item.username"
        @delete-user="deleteUser"
      />
    </div>
  </div>
</template>

<script>
  import UserButtonAction from './UserButtonAction.vue'
  import UserConnexion from './UserConnexion.vue'
  import UserItem from './UserItem.vue'
  export default {
    components: {
      UserButtonAction,
      UserConnexion,
      UserItem
    },
    props: ['item', 'actor', 'actions'],
    computed: {
      connexion() {
        return {
          username: this.item.username,
          last_logout: this.item.last_logout
        }
      }
    },
    methods: {
      deleteUser(username) {
        this.$emit('delete-user', username)
      }
    }
  }
</script>

<style>
  .d-flex {
    align-items: center;
  }
  .user-list-item.d-flex:hover {
    background: #eee;
  }
  .user-list-item > div {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>




