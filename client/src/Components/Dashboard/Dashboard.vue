<template>
  <div class="float-right">
    <div class="d-flex flex-row">
      <dashboard-element v-for="element in elements" :key="element.name" :element="element" @change-type="changeType"/>
    </div>
    <dashboard-list v-if="type" :type="type"  @change-type="changeType"/>
  </div>
</template>

<script>
  import DashboardElement from './DashboardElement.vue'
  import DashboardList from './DashboardList.vue'

  export default {
    components: {
      DashboardElement,
      DashboardList
    },
    data() {
      return ({
        type: ''
      })
    },
    methods: {
      changeType(type) {
        this.type = type
      }
    },
    computed: {
      elements() {
        return [
          {
            name: 'notifications',
            color: 'info',
            title: 'Notifications',
            icon: 'bell',
            value: 10
          },
          {
            name: 'visits',
            color: 'info',
            title: 'Visites',
            icon: 'eye',
            value: 10
          },
          {
            name: 'messages',
            color: 'info',
            title: 'Messages',
            icon: 'envelope',
            value: 10
          },
          {
            name: 'likes',
            color: 'info',
            title: 'Likes',
            icon: 'heart',
            value: 10
          },
          {
            name: 'friends',
            color: 'info',
            title: 'Matchs',
            icon: 'user',
            value: 10
          },
        ]
      }
    }
  }
</script>
