<template>
  <div class="user-list-item d-flex justify-content-between">
    <user-avatar v-if="item.avatar"
      :avatar="item.avatar"
    />
    <div class="user-name">
      {{item.username}}
    </div>
    <div class="user-connected">
      <user-connexion :connexion="connexion" icon="1" />
    </div>
    <div class="user-actions">
      <user-button-action v-for="action in actions" :key="action"
        :type="action"
        :actor="actor"
        :receptor="item.username"
      />
    </div>
  </div>
</template>

<script>
  import UserButtonAction from './UserButtonAction.vue'
  import UserConnexion from './UserConnexion.vue'
  import UserAvatar from './UserAvatar.vue'
  export default {
    components: {
      UserButtonAction,
      UserConnexion,
      UserAvatar
    },
    props: ['item', 'actor', 'actions'],
    computed: {
      connexion() {
        return {
          username: this.item.username,
          last_logout: this.item.last_logout
        }
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
</style>


