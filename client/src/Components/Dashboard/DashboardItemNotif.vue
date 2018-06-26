<template>
  <div>
    <div class="d-flex justify-content-between">
      <small>{{item.created | moment("DD/MM/YY HH:mm")}}</small>
      <b-link @click.prevent="deleteMessage">
        <icon name="trash"></icon>
      </b-link>
    </div>
    <p>{{item.message}}</p>
  </div>
</template>

<script>
  export default {
    props: ['item', 'type'],
    methods: {
      deleteMessage() {
        console.log('deleteMessage', this.item._id)
      }
    }
  }
</script>
