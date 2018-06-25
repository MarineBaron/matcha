<template>
<div>
    <profile-view-image-grande :images="images" />
    <profile-view-image-liste :images="images" />
  {{ images[0].name }}
  <b-img :src="getUrl(images[0].name)" fluid alt="Responsive image" />

</div>
   
</template>

<script>

  import ProfileViewImageGrande from './ProfileViewImageGrande.vue'
  import ProfileViewImageListe from './ProfileViewImageListe.vue'
  export default {
    props: {
        
        images: {
            type: Array
        }
    },
     components: {
        ProfileViewImageGrande,
        ProfileViewImageListe
    },
    methods: {
        getUrl(name){
            return ('http://localhost:5000/images/' + name)
        }
    }
   
  }
</script>