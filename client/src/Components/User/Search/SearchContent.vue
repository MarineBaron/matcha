// affichage liste de membres

<template>
  <div>
    <ul v-if="members.length">
      <MemberListItem
        v-for="member in members"
        :key="member.id"
        :member="member"/>
    </ul>
    <p v-else>
      Aucun membre dans votre sélection.
    </p>
  </div>
</template>

<script>
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
          text: 'Étoile, 60 ans, Designer, Paris ',
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
    }
  }
}
</script>
