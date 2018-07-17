<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab" >
      Filtres
    </b-card-header>
      <b-card-body>
        <b-form-group label="Centre d'intérêts">
          <b-form-checkbox-group
            plain
            id="interests"
            name="interests"
            v-model="interests"
            :options="interestOptions"
            @input="changeFilters"
          />
        </b-form-group>
      </b-card-body>
  </b-card>
</template>

<script>
  export default {
    props: ['status', 'interestOptions'],
    data() {
      return {
        interests: this.interestOptions.map(o => o.value),
      }
    },
    methods: {
      changeFilters() {
        const data = {
          interests: this.interests,
        }
        console.log(data)
        this.$emit('change-filters', data)
      }
    }
  }
</script>