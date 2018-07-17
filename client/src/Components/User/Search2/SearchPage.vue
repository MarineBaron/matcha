<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        <search-result type="search" :status="statusSearch" :users="searches" />
        <search-result type="match" :status="statusMatch" :users="matches" />
      </b-col>
      <b-col cols="4">
        <search-form
          v-if="genderOptions.length"
          :status="statusSearch"
          :genderOptions="genderOptions"
          :interestOptions="interestOptions"
          @change-filters="changeFilters"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import callApi from '../../../Api/callApi'
  import SearchForm from './SearchForm.vue'
  import SearchResult from './SearchResult.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      SearchForm,
      SearchResult
    },
    data() {
      return {
        statusMatch: '',
        statusSearch: '',
        matches: [],
        searches: [],
        filters: {},
        genderOptions: [],
        interestOptions: []
      }
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username
      })
    },
    mounted() {
      this.getInfos()
    },
    methods: {
      changeFilters(filters) {
        this.filters = filters
        //this.fetchSearch()
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
      fetchSearch() {
        this.statusSearch = 'loading'
        let data = this.filters
        data.username = this.username
        callApi({url: '/user/search', data})
        .then((resp) => {
          this.searches = resp.data.data
          this.statusSearch = 'success'
        })
        .catch((err) => {
          console.log(err)
          this.searches = []
          this.statusSearch = 'error'
        })
      },
      fetchMatch() {
        this.statusMatch = 'loading'
        let data = this.filters
        data.username = this.username
        console.log('fetchMatch', data)
        callApi({url: '/user/match', data, method: 'POST'})
        .then((resp) => {
          console.log(resp.data)
          this.matches = resp.data.data
          this.statusMatch = 'success'
        })
        .catch((err) => {
          console.log(err)
          this.matches = []
          this.statusMatch = 'error'
        })
      }
    }
  }
</script>