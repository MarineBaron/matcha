<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        <search-result
          :type="type"
          :status="status"
          :users="users"
          :totalRows="totalRows"
          :currentPage="currentPage"
          :perPage="perPage"
          @change-sort="changeSort"
          @change-type="changeType"
          @change-pagination="changePagination"
          />
      <map-user-all type="match" :status="status" :items="users" :user="user"/>
      </b-col>
      <b-col cols="4">
        <search-form
          v-if="genderOptions.length"
          :type="type"
          :status="status"
          :genderOptions="genderOptions"
          :interestOptions="interestOptions"
          :ageLimits="ageLimits"
          :scoreLimits="scoreLimits"
          :distanceLimits="distanceLimits"
          @change-filters="changeFilters"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import MapUserAll from '../../Map/MapUserAll.vue'
  import callApi from '../../../Api/callApi'
  import SearchForm from './SearchForm.vue'
  import SearchResult from './SearchResult.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      SearchForm,
      SearchResult,
      MapUserAll
    },
    data() {
      return {
        type: 'match',
        status: '',
        users: [],
        filters: {},
        sortOrder: {
          matching: -1,
          distance: 1,
          matchInterests: -1,
          score: -1,
          age: 1,
          genre: 1,
        },
        totalRows: 0,
        perPage: 5,
        currentPage: 1,
        genderOptions: [],
        interestOptions: [],
        ageLimits: [0, 0],
        scoreLimits: [0, 0],
        distanceLimits: [0, 0]
      }
    },
    computed: {
      ...mapState({
        user: state => state.auth.profile,
        username: state => state.auth.profile.username
      })
    },
    mounted() {
      this.getInfos()
    },
    methods: {
      changeType() {
        this.type = this.type === 'match' ? 'search' : 'match'
        this.fetchMatch()
      },
      changeFilters(filters) {
        this.filters = filters
        this.fetchMatch()
      },
      changeSort(sortOrder) {
        this.sortOrder = sortOrder
        this.fetchMatch()
      },
      changePagination(index) {
        this.currentPage = index
        this.fetchMatch()
      },
      getInfos() {
        callApi({url: '/user/infos/' + this.username})
        .then((resp) => {
          this.genderOptions = resp.data.genders.map(o => {
            return {value: o._id, text: o.name}
          })
          this.interestOptions = resp.data.interests.map(o => {
            return {value: o._id, text: o.name}
          })
          this.ageLimits = resp.data.ages
          this.scoreLimits = resp.data.scores
          this.distanceLimits = resp.data.distances
          this.filters = {
            genders: this.genderOptions.map(o => o.value),
            interests: this.interestOptions.map(o => o.value),
            ages: resp.data.ages,
            distances: resp.data.distances,
            scores: resp.data.scores
          }
          this.fetchMatch()
        })
        .catch((err) => {
          console.log(err)
        })
      },
      fetchMatch() {
        this.status = 'loading'
        let data = this.filters
        data.type = this.type
        data.username = this.username
        data.sortOrder = this.sortOrder
        data.perPage = this.perPage
        data.currentPage = this.currentPage
        callApi({url: '/user/match', data, method: 'POST'})
        .then((resp) => {
          this.users = resp.data.users
          this.totalRows = resp.data.total
          this.status = 'success'
        })
        .catch((err) => {
          console.log(err)
          this.users = []
          this.status = 'error'
        })
      }
    }
  }
</script>