<template>
  <div>
    <profile-view-field-group-interets v-for="(group, index) in groups" :key="index" :group="group" />
  </div>
</template>

<script>
  import ProfileViewFieldGroupInterets from './ProfileViewFieldGroupInterets.vue'

  export default {
    props: ['user'],
    components: {
      ProfileViewFieldGroupInterets
    },
    computed: {
      groups() {
        let groups = []

        groups = this.addGroup(groups,
          'Intérêts :', [
          {field: 'gender', name: 'Vous êtes'},
          {field: 'orientation', name: 'Vous recherchez'},
          {field: 'interest', name: 'Vos intérêts'},
        ])
      return groups
      }
    },
    methods: {
      addGroup(groups, title, fields) {
        fields.forEach(f => f.value = this.user[f.field])
        groups.push({
          title: title,
          fields: fields.filter(f => f.value)
        })
        return groups
      }
    }
  }
</script>