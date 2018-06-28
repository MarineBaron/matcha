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
          {field: 'interests', name: 'Vos intérêts'},
        ])
      return groups
      }
    },
    methods: {
      addGroup(groups, title, fields) {
        fields.forEach(f => {
          if (this.user[f.field]) {
            if (Array.isArray(this.user[f.field])) {
              f.value = this.user[f.field].map(v => v.name).join(', ')
            } else {
              f.value = this.user[f.field].name
            }
          }
        })
        groups.push({
          title: title,
          fields: fields.filter(f => f.value)
        })
        return groups
      }
    }
  }
</script>
