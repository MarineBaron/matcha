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

<!-- <div id="photo1" class="autre">
 <img src="http://localhost:5000/images/01.png" width="75%" alt="">
</div> -->

<div id="photo1" class="autre">
 <img src="http://localhost:5000/images/01.png" width="75%" alt="">
</div>
<div id="photo2" class="definition">
 <img src="http://localhost:5000/images/02.png" width="75%" alt="">
</div>
<div id="photo3" class="definition">
 <img src="http://localhost:5000/images/03.png" width="75%" alt="">
</div>
<div id="photo4" class="definition">
 <img src="http://localhost:5000/images/04.png" width="75%" alt="">
</div>
<div id="photo5" class="definition">
 <img src="http://localhost:5000/images/05.png" width="75%" alt="">
</div>
<a href="#photo1"><img src="http://localhost:5000/images/01.png" alt="" width="17%"></a>
<a href="#photo2"><img src="http://localhost:5000/images/02.png" alt="" width="17%"></a>
<a href="#photo3"><img src="http://localhost:5000/images/03.png" alt="" width="17%"></a>
<a href="#photo4"><img src="http://localhost:5000/images/04.png" alt="" width="17%"></a>
<a href="#photo5"><img src="http://localhost:5000/images/05.png" alt="" width="17%"></a>






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
        slide: 0
      }
    },
    methods: {
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
      getImages() {
        
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

.definition:target {
  width: 100%;
}

/*
  DECORATION
*/

a {
  text-decoration: none;
}
small,
.masquer {
/* définition explicite afin de pouvoir interagir dessus par la suite. */
  display: block;
}
.definition, autre {
/* par défaut les définitions sont masquées mais conservées dans le flux. Ce qui permet aux "robots" d'accéder à ce contenu. */
  position: absolute;
  border: 0;
  height: 1px;
  width: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px); /* IE6 & IE7 */
  clip: rect(1px, 1px, 1px, 1px);
}
.definition:target {
/* Lorsqu'une définition est la cible d'un lien (action cliquer), celle-ci rétablit le style des définitions les rendants visibles à l'oeil. */
  position: relative;
  height: auto;
  padding: initial;
  clip: initial;
}
/*
  FIN DU COEUR DU SUJET
*/
/*
  pas mal, hein ?
*/
/*
  DECO DES DEFINITIONS
*/
p:first-of-type {
  font-size: 1.2rem;
}
p:last-of-type {
  font-style: italic;
}
.masquer {
  font-weight: bold;
}
/* 20160625 added */
.definition:target ~ small{
/* cette information est éjectée du flux car non indispensable ni en accessibilité ni en SEO ou autre (où alors un truc auquel je n'ai pas pensé). */
  display: none;
}
/*
  LA FIN DE LA FIN
*/

    </style>
