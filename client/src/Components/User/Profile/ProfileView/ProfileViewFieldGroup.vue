<template>
    <div>
        <p v-if="group.fields.length" >{{group.title}}</p>
        <profile-view-field v-for="field in group.fields" :key="field.field" :field="field" />
     </div>
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