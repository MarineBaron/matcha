<template>
  <b-container fluid>
    <h2>Accueil</h2>

    <b-row>

      <b-col>
        <p style="text-align:justify;"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum tempor tortor, ut aliquam lorem condimentum sed. Pellentesque ut est ex. Maecenas consectetur in metus vel pretium. Suspendisse molestie orci quis nisl ornare egestas. Quisque eu ipsum sit amet sem rhoncus rutrum. Aenean ac finibus augue. Sed tempor facilisis orci eu vehicula. In dignissim sapien vitae ex gravida, et mollis dui maximus. Integer vitae quam porttitor orci eleifend dapibus in ac diam. Etiam sagittis odio felis, ultrices porta dui viverra a. Integer ut gravida ipsum. Sed laoreet tempus risus, in egestas arcu efficitur et. Aenean bibendum vulputate mi, eget sodales urna gravida ut. Nam augue odio, dictum quis ipsum non, suscipit feugiat nunc. Duis blandit viverra purus, tincidunt imperdiet lacus tincidunt nec. Duis non consequat diam.
        <br />
        Vivamus tincidunt, arcu sed convallis fringilla, ante nulla elementum lorem, ac posuere est erat at dolor. Aliquam tempus ipsum nulla, et facilisis mi accumsan ullamcorper. Etiam pellentesque, ante sed luctus consequat, orci nulla viverra urna, vitae imperdiet nunc justo convallis metus. Sed et eleifend tortor. Fusce a scelerisque ipsum, sed malesuada augue. Fusce a justo condimentum, mattis sapien ac, congue neque. Vestibulum nec erat nisl. Aliquam commodo rutrum dolor, non volutpat nulla volutpat nec. Morbi elit magna, dapibus at elementum et, auctor et nisi.
        </p>
      </b-col>


      <b-col cols="4" class="toto">
        <b-container fluid>
        <div v-if="!users.length">Pas de users</div>
          <b-row v-else>    
            <b-col md="6" v-for="user in users"  :key="user.username" class="titi">
              <user-item-large :user="user"/>
            </b-col>
          </b-row>
          <b-button v-if="displayMore" @click="searchMore">Autres</b-button>
          </b-container>
      </b-col>

    </b-row>

  </b-container>
</template>

<script>
  import UserItemLarge from '../User/All/UserItemLarge.vue'
  import callApi from '../../Api/callApi'
  export default {
    components: {
      UserItemLarge,
      callApi
    },
    data() {
      return {
        users: [],
        status: '',
        page: 0,
        nbByPage: 9,
        displayMore: true
      }
    },
    mounted(){
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.status = 'loading'
        callApi({url: '/user/users/' + this.nbByPage + '/' + this.page})
        .then((resp) => {
          this.status = 'success'
          if (resp.data.data.length) {
            resp.data.data.map(u => this.users.push(u))
          } else {
            this.displayMore = false
          }
        })
        .catch((err) => {
          this.status = 'error'
          this.users = []
        })
      },
      searchMore() {
        this.page++
        this.fetchData()
      }
    }
  }
</script>
<style scoped>
  
</style>
