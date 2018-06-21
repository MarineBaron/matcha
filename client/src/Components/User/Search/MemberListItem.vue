<template>
  <b-container class="bv-example-row">
      <b-row class="text-left">
          <b-col>{{ member.photo }}</b-col>
          <b-col cols="6">{{ member.text }}</b-col>
          <b-col cols="2">
            <button @click="member.likes++,
              $emit('plus-moi', member.text)">Likes {{ member.likes }}
            </button></b-col>
      </b-row>
  </b-container>
</template>

<script>
  export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  }
}
</script>
