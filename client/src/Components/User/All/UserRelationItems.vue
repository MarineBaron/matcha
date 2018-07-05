<template>
  <b-container>
    <b-row>
      <b-col v-for="user in users" :key="user.username"
        cols="4"
        class="text-center"
      >
        <b-link :to="{path: '/user/' + user.username}">
          <b-img v-if="user.avatar" :src="IMAGES_URL + '/' + user.avatar.image.name" center thumbnail fluid alt="user.avatar.alt" />
          {{user.username}}
        </b-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import config from '../../../Config/config'
  export default {
    props: ['users'],
    data() {
      return ({
        IMAGES_URL: config.IMAGES_URL
      })
    }
  }
</script>
