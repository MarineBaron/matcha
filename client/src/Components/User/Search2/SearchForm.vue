<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab" >
      Filtres
    </b-card-header>
      <b-card-body>
        <b-form-group v-if="type === 'search'" label="Genres">
          <b-form-checkbox-group
            plain
            id="genders"
            name="genders"
            v-model="genders"
            :options="genderOptions"
            @input="changeFilters"
            :disabled="disableField"
          />
        </b-form-group>
        <b-form-group label="Centre d'intérêts">
          <b-form-checkbox-group
            plain
            id="interests"
            name="interests"
            v-model="interests"
            :options="interestOptions"
            @input="changeFilters"
            :disabled="disableField"
          />
        </b-form-group>
        <b-form-group label="Age" class="slider-input">
          <vue-slider
              ref="slider_age"
              v-model="ages"
              v-bind="ageOptions"
              @drag-end="changeFilters"
          />
        </b-form-group>
        <b-form-group label="Score">
          <vue-slider
              ref="slider_score"
              v-model="scores"
              v-bind="scoreOptions"
              @drag-end="changeFilters"
          />
        </b-form-group>
        <b-form-group label="Distance">
          <vue-slider
              ref="slider_distance"
              v-model="distances"
              v-bind="distanceOptions"
              @drag-end="changeFilters"
          />
        </b-form-group>
      </b-card-body>
  </b-card>
</template>

<script>
  import VueSlider from 'vue-slider-component'
  export default {
    components: {
      VueSlider
    },
    props: ['type', 'status', 'genderOptions', 'interestOptions', 'ageLimits', 'scoreLimits', 'distanceLimits'],
    data() {
      return {
        genders: this.genderOptions.map(o => o.value),
        interests: this.interestOptions.map(o => o.value),
        ages: this.ageLimits,
        scores: this.scoreLimits,
        distances: this.distanceLimits,
        ageOptions: {
          eventType: 'auto',
          width: 'auto',
          height: 6,
          dotSize: 16,
          dotHeight: null,
          dotWidth: null,
          interval: 1,
          show: true,
          speed: 0.5,
          disabled: this.disableField,
          piecewise: false,
          piecewiseStyle: false,
          piecewiseLabel: false,
          tooltip: "always",
          tooltipDir: 'top',
          reverse: false,
          data: null,
          clickable: true,
          realTime: false,
          lazy: false,
          formatter: null,
          bgStyle: null,
          sliderStyle: null,
          processStyle: null,
          piecewiseActiveStyle: null,
          piecewiseStyle: null,
          tooltipStyle: null,
          labelStyle: null,
          labelActiveStyle: null,
          min: this.ageLimits[0],
          max: this.ageLimits[1]
        },
        scoreOptions: {
          eventType: 'auto',
          width: 'auto',
          height: 6,
          dotSize: 16,
          dotHeight: null,
          dotWidth: null,
          interval: 1,
          show: true,
          speed: 0.5,
          disabled: this.disableField,
          piecewise: false,
          piecewiseStyle: false,
          piecewiseLabel: false,
          tooltip: "always",
          tooltipDir: 'top',
          reverse: false,
          data: null,
          clickable: true,
          realTime: false,
          lazy: false,
          formatter: null,
          bgStyle: null,
          sliderStyle: null,
          processStyle: null,
          piecewiseActiveStyle: null,
          piecewiseStyle: null,
          tooltipStyle: null,
          labelStyle: null,
          labelActiveStyle: null,
          min: this.scoreLimits[0],
          max: this.scoreLimits[1]
        },
        distanceOptions: {
          eventType: 'auto',
          width: 'auto',
          height: 6,
          dotSize: 16,
          dotHeight: null,
          dotWidth: null,
          interval: 1,
          show: true,
          speed: 0.5,
          disabled: this.disableField,
          piecewise: false,
          piecewiseStyle: false,
          piecewiseLabel: false,
          tooltip: "always",
          tooltipDir: 'top',
          reverse: false,
          data: null,
          clickable: true,
          realTime: false,
          lazy: false,
          formatter: null,
          bgStyle: null,
          sliderStyle: null,
          processStyle: null,
          piecewiseActiveStyle: null,
          piecewiseStyle: null,
          tooltipStyle: null,
          labelStyle: null,
          labelActiveStyle: null,
          min: this.distanceLimits[0],
          max: this.distanceLimits[1]
        }
      }
    },
    methods: {
      changeFilters() {
        if(!this.disableField) {
          const data = {
            genders: this.genders,
            interests: this.interests,
            ages: this.ages,
            scores: this.scores,
            distances: this.distances,
          }
          this.$emit('change-filters', data)
        }
      },

    },
    computed: {
      disableField: () => this.status === 'loading'
    }
  }
</script>

<style scoped>
  .vue-slider-component {
    margin-top: 30px;
    height: 30px;
  }
</style>