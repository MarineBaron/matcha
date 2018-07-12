<template>
  <b-table striped hover :items="users" :fields="fields">
    <template slot="username" slot-scope="data">
      <b-link :to="{path: '/user/' + data.item.username}">{{data.item.username}}</b-link>
    </template>
    <template slot="confirmed" slot-scope="data">
      <icon v-if="data.item.confirmed" name="check" color="green" />
      <icon v-else name="times" color="red" />
    </template>
    <template slot="is_completed" slot-scope="data">
      <icon v-if="data.item.is_completed" name="check" color="green" />
      <icon v-else name="times" color="red" />
    </template>
    <template slot="bot" slot-scope="data">
      <icon v-if="data.item.bot" name="check" color="green" />
      <icon v-else name="times" color="red" />
    </template>
    <template slot="actions" slot-scope="data">
      <b-link v-if="data.item.bot" @click.prevent="deleteUser(data.item._id)" title="Supprimer">
        <icon name="trash"></icon>
      </b-link>
    </template>
  </b-table>
</template>

<script>
  import callApi from '../../../Api/callApi'
  export default {
    props: ['status', 'refresh'],
    data() {
      return {
        fields: [
          {
            key: 'username',
            sortable: true
          },
          {
            key: 'confirmed',
            label: 'Confirmé',
            sortable: true
          },
          {
            key: 'is_completed',
            label: 'Complet',
            sortable: true
          },
          {
            key: 'bot',
            label: 'Bot',
            sortable: true
          },
          {
            key: 'actions',
            sortable: false
          }
        ],
        users: []
      }
    },
    mounted() {
      if (this.refresh) {
        this.fetchData()
      }
    },
    methods: {
      fetchData() {
        this.$emit('change-refresh', false)
        this.$emit('change-status', 'loading')
        callApi({url: '/admin/users'})
        .then((resp) => {
          this.$emit('change-status', 'success')
          this.users = resp.data.data
        }, (err) => {
          this.$emit('change-status', 'error')
          console.log('ERR', err)
        })
      },
      deleteUser(id) {
        if(this.status === 'success') {
          callApi({url: '/admin/delete/' + id})
          .then((resp) => {
            this.$emit('change-refresh', true)
          }, (err) => {
            console.log('ERR', err)
          })
        }
      },
    },
    computed: {
      askRefresh() {
        if (this.refresh) {
          this.fetchData()
        }
      }
    }
  }
</script>