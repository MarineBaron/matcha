<template>

<b-card v-bind:header="group.title"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="lightsragreen"
          footer=""
          footer-tag=""
          footer-bg-variant="success"
          footer-border-variant="dark"
          title=""
          style="max-width: 20rem;"
  >
   <profile-view-field v-for="field in group.fields" :key="field.field" :field="field" />
  </b-card>

    <!-- <div>
        <p v-if="group.fields.length" >{{group.title}}</p>
        <profile-view-field v-for="field in group.fields" :key="field.field" :field="field" />
     </div> -->
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