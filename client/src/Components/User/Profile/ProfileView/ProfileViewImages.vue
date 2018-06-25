<template>
<div>
    <profile-view-grande :images="images" />
    <profile-view-liste :images="images" />
  {{ images[0].name }}
  <b-img :src="getUrl(images[0].name)" fluid alt="Responsive image" />

</div>
   
</template>

<script>

  import ProfileViewGrande from './ProfileView/ProfilViewImageGrande.vue'
  import ProfileViewListe from './ProfileView/ProfilViewImageListe.vue'
  export default {
    props: {
        
        images: {
            type: Array
        }
    },
    methods: {
        getUrl(name){
            return ('http://localhost:5000/images/' + name)
        }
    }
   
  }
</script>