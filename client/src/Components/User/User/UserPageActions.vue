<template>
  <div class="clearfix">
    <h3>{{title}}</h3>
    <div class="d-flex justify-content-start">
      <user-button-action v-if="!relationStatus.isLiked && !relationStatus.isFriend"
        type="like"
        :actor="actor"
        :receptor="receptor"
        :scale="scale"
      />
      <user-button-action v-if="relationStatus.isLiked||relationStatus.isFriend"
        type="unlike"
        :actor="actor"
        :receptor="receptor"
        :scale="scale"
      /><user-button-action v-if="relationStatus.isFriend"
        type="chat"
        :actor="actor"
        :receptor="receptor"
        :scale="scale"
      />
    </div>
  </div>
</template>

<script>
  import UserButtonAction from '../All/UserButtonAction.vue'
  export default {
    components: {
      UserButtonAction
    },
    props: ['actor', 'receptor', 'relationStatus'],
    data() {
      return ({
        title: 'Actions',
        scale: 2
      })
    }
  }
</script>