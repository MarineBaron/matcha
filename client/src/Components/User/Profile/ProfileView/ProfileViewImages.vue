<template>
<div>
    <profile-view-image-grande v-if="image" :image="image" />
    <profile-view-image-liste :images="images" @change-image="changeImage"/>
  <h2>{{ image }}</h2>
 

</div>
   
</template>

<script>

  import ProfileViewImageGrande from './ProfileViewImageGrande.vue'
  import ProfileViewImageListe from './ProfileViewImageListe.vue'
  export default {
      data() {
      return {
        image: {}
      }
    },
    props: {
        images: {
            type: Array
        },
       
    },
     components: {
        ProfileViewImageGrande,
        ProfileViewImageListe
    },
    methods: {
        getUrl(name){
            return ('http://localhost:5000/images/' + name)
        },
        changeImage(image) {
            this.image = image
        }
    }
   
  }
</script>