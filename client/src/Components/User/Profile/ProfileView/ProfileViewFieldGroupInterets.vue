<template>

<b-card v-bind:header="group.title"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="info"
          title=""
          style="max-width: 20rem;"
  >
   <profile-view-field v-for="field in group.fields" :key="field.field" :field="field" />
  </b-card>
</template>
<script>
    import ProfileViewField from './ProfileViewField.vue'
  export default {
    props: {
      group: {
        type: Object
      }
    },
    components: {
        ProfileViewField
    }
  }
</script>