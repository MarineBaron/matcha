<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        <search-result type="search" :status="statusSearch" :users="searches" />
        <search-result type="match" :status="statusMatch" :users="matches" />
      </b-col>
      <b-col cols="4">
        <search-form :status="statusSearch" @change-filter="changeFilters"/>
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
        filters: [],
      }
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username
      })
    },
    mounted() {
      this.fetchMatch()
    },
    methods: {
      changeFilters(filters) {
        this.filters = filters
        this.fetchSearch()
      },
      fetchSearch() {
        this.statusSearch = 'loading'
        const data = {
          username: this.username
        }
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
        const data = {
            username: this.username
        }
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