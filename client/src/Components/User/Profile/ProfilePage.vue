<template>
   <b-container>
    <h2>{{title}}</h2>

         <b-list-group>          
            <b-list-group-item style="background-color: rgba(0, 0, 0, 0);"> 
               <div>{{ user.username }}</div> 
            </b-list-group-item>
        </b-list-group>

            <div id="InfoRight">
                <b-button class="btn btn-info" title="Visite">
                <icon name="eye"></icon> <span class="badge badge-light">10</span>
                </b-button>
                <b-button class="btn btn-info" title="Mails en attente">
                   <icon name="envelope"></icon> <span class="badge badge-light">4</span>
                </b-button>
                <b-button class="btn btn-info" title="Coup de Coeur">
                    <icon name="heart"></icon> <span class="badge badge-light">4</span>
                </b-button>
                <b-button class="btn btn-info" title="Amis">
                     <icon name="user"></icon> <span class="badge  badge-light">4</span>
                </b-button>
            </div>
    

          <b-row>
       <b-col sm="8">
 
       <b-col sm="4">
<div>
    <b-carousel id="carousel1"
                style="text-shadow: 1px 1px 2px #333;"
                controls
                background="#ababab"
                :interval="0"
                img-width="100"
                img-height="100"
                v-model="slide"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
    >

      <!-- Text slides with image -->
      <b-carousel-slide 
                        id="Slide00"
                        img-src="http://localhost:5000/images/00.png"
      ></b-carousel-slide>

  <!-- Text slides with image -->
      <b-carousel-slide 
                        id="Slide00"
                        img-src="http://localhost:5000/images/01.png"
      ></b-carousel-slide>

      <!-- Text slides with image -->
      <b-carousel-slide 
                        id="Slide00"                       
                        img-src="http://localhost:5000/images/02.png"
      ></b-carousel-slide>

      <!-- Text slides with image -->
      <b-carousel-slide 
                        id="Slide00"                        
                        img-src="http://localhost:5000/images/03.png"
      ></b-carousel-slide>

      <!-- Text slides with image -->
      <b-carousel-slide                         
                        id="Slide00"
                        img-src="http://localhost:5000/images/04.png"
      ></b-carousel-slide>

    </b-carousel>

   <b-img center src="http://localhost:5000/images/00.png" id="00" width="50" height="50" alt="center image" v-on:click="SeeSlide('00')"/>
   <b-img center src="http://localhost:5000/images/01.png" id="01" width="50" height="50" alt="center image" v-on:click="SeeSlide('01')" />
   <b-img center src="http://localhost:5000/images/02.png" id="02" width="50" height="50" alt="center image" v-on:click="SeeSlide('02')" />


  
  </div>
 </b-col>
     <b-col sm="4">

 </b-col>

















        </b-col>
        <b-col sm="4"><my-friends></my-friends></b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import ProfileView from './ProfileView.vue'
  import ProfileForm from './ProfileForm.vue'
  import MyFriends from '../All/MyFriends.vue'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      ProfileView,
      MyFriends, 
      ProfileForm,
    },
    data() {
      return {
        mode: 'view',
        title: 'Votre Interface',
        buttonText: 'Editer',
        resume: 'toto',
        user: {},
        error: '',
        slide: 0,
        sliding: null
      }
    },
    methods: {
      SeeSlide: function(e){
        console.log("slide"+e)
        document.getElementById('Slide' + e).style.display = block;
      }, 
      onClick(e) {
        // this.mode = this.mode === 'edit' ? 'view' : 'edit'
        // this.buttonText = this.mode === 'edit' ? 'Voir' : 'Editer'
      },
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      }
    },
    computed: {
      ...mapState({
        username: state => `${state.auth.profile.username}`
      })
    },
    mounted() {
      //this.$store.dispatch(USER_USER_REQUEST, localStorage.getItem('username'))
      this.$store.dispatch(USER_USER_REQUEST, this.username)
      .then((response) => {
        console.log("USR", response)
        this.user = response
      }, (error) => {
        this.error = "Une erreur est survenue lors de la confirmation de votre inscription."
      })
    }
  }
</script>
<style>
    .breadcrumb-item {
        font-variant-caps:small-caps;
        font-size: 25px;
    }
    div#infos {
        float: right;
        margin-top: -25px;
      }
     #InfoRight  {
          float: right;
          margin-top: -44px;
          margin-right: 4px;
      }

    </style>
