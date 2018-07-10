<template>
  <div class="user-avatar">
    <b-img :src=" IMAGES_URL + '/' + avatar.image.name" fluid :alt="avatar.alt" />
  </div>
</template>

<script>
  import config from '../../../Config/config'
  export default {
    props: ['avatar'],
    data() {
      return {
        IMAGES_URL: config.IMAGES_URL
      }
    }
  }
</script>

<style>
  div.user-avatar {
    display: inline-block;
    width: 50px;
  }
</style>