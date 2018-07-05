<template>
  <div role="tablist">
    <h3>{{title}}</h3>
    <b-card v-if="relations.friends && relations.friends.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_friends variant="info">Ils s'aiment</b-btn>
      </b-card-header>
      <b-collapse id="accordion_friends" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <user-relation-items :users="relations.friends" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relations.likes && relations.likes.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_likes variant="info">Il les aime</b-btn>
      </b-card-header>
      <b-collapse id="accordion_likes" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <user-relation-items :users="relations.likes" />
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card v-if="relations.likers && relations.likers.length" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" v-b-toggle.accordion_likers variant="info">Ils l'aiment</b-btn>
      </b-card-header>
      <b-collapse id="accordion_likers" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <user-relation-items :users="relations.likers" />
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
  import UserRelationItems from './UserRelationItems.vue'
  export default {
    components: {
      UserRelationItems
    },
    props: ['relations', 'relationStatus'],
    data() {
      return ({
        title: 'Relations',
      })
    },
    mounted() {
      console.log(this.relations)
    }
  }
</script>