// affichage liste de membres

<template>
  <div>
    <p v-if="members.length">
      <MemberListItem
        v-for="member in orderedMembers"

        :key="member.id"
        :member="member"
        v-on:plus-moi="onPlusMoi ($event)"/>
    </p>
    <p v-else>
      Aucun membre ne correspond à votre sélection.
    </p>

    <h5 v-if=liked>
      Qui s'est fait Liker, uh?
      <b-badge>{{ liked }}</b-badge></h5>

  </div>
</template>

<script>
  import { USER_USERS_REQUEST } from '../../../Store/user/mutation-types'
  import MemberListItem from './MemberListItem.vue'

  let nextMemberId = 0

  export default {
    components: {
      MemberListItem
    },
    data () {
      return {
        members: [
          {
            id: nextMemberId++,
            photo: 'Photo Étoile',
            text: 'Etoile, 60 ans, Designer, Paris ',
            likes: 2
          },
          {
            id: nextMemberId++,
            photo: 'Photo MarieLaure',
            text: 'MarieLaure, 57 ans, Hospitalière, Paris ',
            likes: 3
          },
          {
            id: nextMemberId++,
            photo: 'Photo Nina',
            text: 'Nina, 57 ans, Artiste, Paris ',
            likes: 1
          }
        ],
        liked: '',
      }
    },
    methods: {
      onPlusMoi: function (id) {
      console.log(id)
      this.liked = id
      }
    },
    //mounted() {
    //  this.$store.dispatch(USER_USERS_REQUEST)
    //  .then((response) => {
    //    this.members = response
    //    console.log("Chargement des gentils membres")
    //  },
    //   (error) => {
    //    console.log(error)
    //  })
    //}
    computed: {
      orderedMembers: function () {
        return _.orderBy(this.members, ['likes', 'text'], ['desc', 'asc'])
      }
    }
  }
</script>
