<template>
  <div class="clearfix">
    <h3>{{title}}</h3>
    <div class="d-flex justify-content-start">
      <b-button variant="link"
        :title="value"
        @click.prevent="onClick"
      ><icon :name="icon" :scale="scale ? scale : 1" /></b-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['mode'],
    data() {
      return ({
        title: 'Actions',
        scale: 2
      })
    },
    methods: {
      onClick(e) {
        this.$emit('toggle-mode', this.mode)
      }
    },
    computed: {
      icon() {
        return this.mode === 'edit' ? 'eye' : 'edit'
      },
      value() {
        return this.mode === 'edit' ? 'Voir' : 'Modifier'
      }
    }
  }
</script>