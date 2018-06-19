<template>
  <b-container class="bv-example-row">
      <b-row class="text-center">
          <b-col>{{ member.photo }}</b-col>
          <b-col cols="6">{{ member.text }}</b-col>
          <b-col cols="2">{{ member.likes }}
            <button @click="member.likes++">+moi
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
