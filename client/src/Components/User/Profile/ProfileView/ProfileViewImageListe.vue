<template>


       <ul id="ulthumb">
            <li v-for="image in images " :key="image._id">
                <b-link v-on:click="onClick(image)" >
                     <b-img :src="getUrl(image)"  alt="alt" width="35px" />
                </b-link>               
            </li>
        </ul>
</template>
<script>

  export default {
      data() {
      return {
      }
    },
    props: {
        
        images: {
            type: Array
        }
    },
     components: {
       
    },
    updated() {
        this.$emit('change-image', this.images[0])
    },
    methods: {
        onClick(e) {
        console.log(e)
        this.$emit('change-image', e)
        },
        getUrl(image){
            return ('http://localhost:5000/images/' + image.name)
        }
        
    }
   
  }
</script>

<style>
.card header div {
    font-weight: bold;
    font-size: 1.25em;
}
</style>
