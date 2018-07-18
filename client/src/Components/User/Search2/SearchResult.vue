<template>
  <b-container fluid v-if="status !== ''">
    <b-button class="float-right" @click="$emit('change-type')">{{buttonValue}}</b-button>
    <h3>{{title}}</h3>
    <div v-if="status === 'loading'">
      Loading
    </div>
    <div v-if="status === 'error'">
      Erreur lors du chargement de vos données
    </div>
    <div v-if="status === 'success' && !users.length">
      Aucun utilisateur
    </div>
    <div v-if="status === 'success' && users.length">
      <b-table
        striped hover
        :items="users"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        no-local-sorting
        @sort-changed="sortingChange"
        >
        <template slot="matching" slot-scope="data">
          <user-item :user="data.item" />
        </template>
        <template slot="score" slot-scope="data">
          {{data.item.score}}
        </template>
        <template slot="gender" slot-scope="data">
          {{data.item.gender}}
        </template>
        <template slot="matchInterests" slot-scope="data">
          {{data.item.interests.map(i => i.name).join(', ')}}
        </template>
        <template slot="age" slot-scope="data">
          {{data.item.age}}
        </template>
        <template slot="distance" slot-scope="data">
          {{  data.item.city }}
          <br />
          ({{  data.item.distance }} km)
        </template>
      </b-table>
      <b-row>
        <b-col>
          <b-pagination align="center" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" @change="changePagination"/>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
  import UserItem from '../All/UserItem.vue'
  export default {
    components: {
      UserItem
    },
    props: ['type', 'status', 'users', 'totalRows', 'perPage', 'currentPage'],
    data() {
      return {
        sortBy: 'matching',
        sortDesc: true,
        sortOrder: [
          {field: 'matching', asc: -1},
          {field: 'distance', asc: 1},
          {field: 'matchInterests', asc: -1},
          {field: 'score', asc: -1},
          {field: 'age', asc: 1},
          {field: 'gender', asc: 1}
        ],
        fields: [
          {
            key: 'matching',
            label: 'Matching',
            sortable: true
          },
          {
            key: 'score',
            label: 'Score',
            sortable: true
          },
          {
            key: 'gender',
            label: 'Genre',
            sortable: true
          },
          {
            key: 'matchInterests',
            label: 'Intérêts',
            sortable: true
          },
          {
            key: 'age',
            label: 'Age',
            sortable: true
          },
          {
            key: 'distance',
            label: 'Distance',
            sortable: true
          },
        ],
      }
    },
    computed: {
      title() {
        return this.type === 'match' ? 'Matching' : 'Votre recherche'
      },
      buttonValue() {
        return this.type === 'match' ? 'Recherche' : 'Matching'
      }
    },
    methods: {
      sortingChange(ctx) {
        this.sortBy = ctx.sortBy
        this.sortDesc = ctx.sortDesc
        const index = this.sortOrder.findIndex(s => s.field === ctx.sortBy)
        const obj = this.sortOrder[index]
        obj.asc = ctx.sortDesc ? -1 : 1
        this.sortOrder.splice(index, 1)
        this.sortOrder.splice(0, 0, obj)
        const sort = {}
        this.sortOrder.forEach(s => {
          sort[s.field] = s.asc
        })
        this.$emit('change-sort', sort)
      },
      changePagination(index) {
        //this.currentPage = index
        this.$emit('change-pagination', index)
      },
    }
  }
</script>