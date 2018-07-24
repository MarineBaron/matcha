<template>
  <div class="user-avatar">
    <b-img :style="styleObject" :src="IMAGES_URL + '/' + avatar.image.name" fluid :alt="avatar.alt" />
  </div>
</template>

<script>
  import config from '../../../Config/config'
  export default {
    props: ['avatar', 'width'],
    data() {
      return {
        IMAGES_URL: config.IMAGES_URL,
        styleObject: {
          width: (!this.width ? '50' :this.width) + 'px'
        }
      }
    }
  }
</script>

<style>
  div.user-avatar {
    display: inline-block;
    /*width: 50px;*/
  }
</style>