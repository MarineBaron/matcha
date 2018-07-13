<template>
  <b-container fluid>
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group>
          <label for="radios-confirmed">Confirmé :</label>
          <b-form-radio-group  plain id="radios-confirmed" :options="options" name="confirmed" @click.native="filterClick" :disabled="status !== 'success'">
          </b-form-radio-group>
        </b-form-group>
        <b-form-group>
          <label for="radios-is_completed">Complet :</label>
          <b-form-radio-group  plain id="radios-is_completed"  :options="options" name="is_completed" @click.native="filterClick" :disabled="status !== 'success'">
          </b-form-radio-group>
        </b-form-group>
        <b-form-group>
          <label for="radios-bot">Bot :</label>
          <b-form-radio-group  plain id="radios-bot" :options="options" name="bot" @click.native="filterClick" :disabled="status !== 'success'">
          </b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-table
      id="admin_users"
      striped hover
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :v-model="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      no-local-sorting
      @context-changed="fetchData"
      >
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
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" @change="changePagination"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import callApi from '../../../Api/callApi'
  export default {
    props: ['status', 'refresh'],
    data() {
      return {
        isBusy: false,
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        sortBy: 'username',
        sortDesc: false,
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
        items: [],
        options: [
          {text: 'Indifférent', value: null},
          {text: 'Oui', value: true},
          {text: 'Non', value: false}
        ],
        filters: {
          confirmed: null,
          is_completed: null,
          bot: null
        }
      }
    },
    methods: {
      fetchData(ctx) {
        this.$emit('change-refresh', false)
        this.$emit('change-status', 'loading')
        const data = {
          perPage: this.perPage,
          currentPage: this.currentPage,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        }
        const filters = {}
        if(this.filters.confirmed !== null) {
          filters.confirmed = this.filters.confirmed
        }
        if(this.filters.is_completed !== null) {
          filters.is_completed = this.filters.is_completed
        }
        if(this.filters.bot !== null) {
          filters.bot = this.filters.bot
        }
        data.filters = filters
        callApi({url: '/admin/users', data, method: 'POST'})
        .then((resp) => {
          this.$emit('change-status', 'success')
          console.log('fetchData', resp.data.total, resp.data.data)
          this.items = resp.data.data
          this.totalRows = resp.data.total
        }, (err) => {
          this.$emit('change-status', 'error')
          console.log('ERR', err)
          this.fetchUsers = []
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
      changePagination(index) {
        this.currentPage = index
        this.fetchData()
      },
      filterClick(e) {
        if(e.target.value === 'true') {
          this.filters[e.target.name] = true
        } else if (e.target.value === 'false') {
          this.filters[e.target.name] = false
        } else {
          this.filters[e.target.name] = null
        }
        this.filters[e.target.name] = e.target.value
        this.fetchData()
      }
    },
    created () {
      this.fetchData()
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