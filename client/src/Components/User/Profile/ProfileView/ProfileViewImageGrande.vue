<template>
     <b-img v-if="image.name !== undefined" :src="getUrl(image)" fluid alt="Responsive image" width="150px" />
</template>
<script>

  export default {
      
    props: {
        
        image: {
            type: Object
        }
    },
     components: {
       
    },
    methods: {
        getUrl(image){
            return ('http://localhost:5000/images/' + image.name)
        }
    }
   
  }
</script>