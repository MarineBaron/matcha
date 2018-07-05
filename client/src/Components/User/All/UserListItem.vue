<template>
  <div class="user-list-item d-flex justify-content-between">
    <div class="user-avatar">
      <b-img v-if="item.avatar" :src=" IMAGES_URL + '/' + item.avatar.image.name" fluid :alt="item.avatar.alt" />
    </div>
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
  import config from '../../../Config/config'
  import UserButtonAction from './UserButtonAction.vue'
  import UserConnexion from './UserConnexion.vue'
  export default {
    components: {
      UserButtonAction,
      UserConnexion
    },
    props: ['item', 'actor', 'actions'],
    data() {
      return {
        IMAGES_URL: config.IMAGES_URL
      }
    },
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
  .user-avatar {
    width: 50px;
  }
</style>


