<template>
  <div>
    <h2>{{title}}</h2>
    <b-button
      variant="primary"
      @click.prevent="onClick">
      {{buttonText}}
    </b-button>
    <profile-view v-bind:mode="mode" v-if="mode==='view'"></profile-view>
    <profile-form v-bind:mode="mode" v-else></profile-form>
  </div>
</template>

<script>
  import ProfileView from './ProfileView.vue'
  import ProfileForm from './ProfileForm.vue'
  export default {
    components: {
      ProfileView,
      ProfileForm
    },
    data() {
      return {
        mode: 'view',
        title: 'Profile Page',
        buttonText: 'Editer'
      }
    },
    methods: {
      onClick(e) {
        this.mode = this.mode === 'edit' ? 'view' : 'edit'
        this.buttonText = this.mode === 'edit' ? 'Voir' : 'Editer'
      }
    }
  }
</script>
