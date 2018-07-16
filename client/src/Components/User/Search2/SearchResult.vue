<template>
  <b-container fluid v-if="status !== ''">
    <h3>{{title}}</h3>
    <div v-if="status === 'loading'">
      Loading
    </div>
    <div v-if="status === 'error'">
      Erreur lors du chargement de vos données
    </div>
    <div v-if="status === 'success' && !users.length">
      Aucun utilisateur
    </div>
    <div v-if="status === 'success' && users.length">
      <div v-for="user in users">{{user.username}}</div>
    </div>
  </b-container>
</template>

<script>
  export default {
    props: ['type', 'status', 'users'],
    data() {
      return {
      }
    },
    computed: {
      title() {
        return this.type === 'match' ? 'Matching' : 'Votre recherche'
      }
    }
  }
</script>