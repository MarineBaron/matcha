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
      @sort-changed="sortingChange"
      >
      <template slot="username" slot-scope="data">
        <user-list-item
          :item="data.item"
          actor="admin"
          :actions="['view', 'delete']"
          @delete-user="deleteUser"
        />
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
    </b-table>
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" @change="changePagination"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import UserListItem from '../../User/All/UserListItem.vue'
  export default {
    components: {
      UserListItem
    },
    props: ['status', 'params', 'items', 'totalRows'],
    data() {
      return {
        localparams: this.params,
        perPage: this.params.perPage,
        currentPage: this.params.currentPage,
        sortBy: this.params.sortBy,
        sortDesc: this.params.sortDesc,
        isBusy: false,
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
        ],
        options: [
          {text: 'Indifférent', value: null},
          {text: 'Oui', value: true},
          {text: 'Non', value: false}
        ],
      }
    },
    methods: {
      sortingChange(ctx) {
        this.localparams.sortDesc = ctx.sortDesc
        this.localparams.sortBy = ctx.sortBy
        this.$emit('change-params', this.localparams)
      },
      changePagination(index) {
        this.currentPage = index
        this.localparams.currentPage = index
        this.$emit('change-params', this.localparams)
      },
      filterClick(e) {
        if(e.target.value === 'true') {
          this.localparams.filters[e.target.name] = true
        } else if (e.target.value === 'false') {
          this.localparams.filters[e.target.name] = false
        } else {
          this.localparams.filters[e.target.name] = null
        }
        this.$emit('change-params', this.localparams)
      },
      deleteUser(username) {
        this.$emit('delete-user', username)
      }
    }
  }
</script>