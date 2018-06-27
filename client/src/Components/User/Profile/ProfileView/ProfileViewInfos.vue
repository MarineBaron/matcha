<template>
  <div>
    <profile-view-field-group v-for="(group, index) in groups" :key="index" :group="group" />
  </div>
</template>

<script>
  import ProfileViewFieldGroup from './ProfileViewFieldGroup.vue'

  export default {
    props: ['user'],
    components: {
      ProfileViewFieldGroup
    },
    computed: {
      groups() {
        let groups = []
        
        groups = this.addGroup(groups,
          'Identification :', [
          {field: 'username', name: 'Pseudo'},
          {field: 'email', name: 'Email'},
        ])
        groups = this.addGroup(groups,
          'Coordonnées :', [
            {field: 'zip', name: 'CP'},
          {field: 'city', name: 'Ville'},
        ])
        // groups = this.addGroup(groups,
        //   'Intérêts :', [
        //   {field: 'gender', name: 'Vous êtes'},
        //   {field: 'orientation', name: 'Vous recherchez'},
        //   {field: 'interest', name: 'Vos intérêts'},
        // ])
        groups = this.addGroup(groups,
          '', [
          {field: 'firstname', name: 'Prénom'},
          {field: 'lastname', name: 'Nom'},
          {field: 'age', name: 'Age'},
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