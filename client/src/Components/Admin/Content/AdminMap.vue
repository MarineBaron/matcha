<template>
  <div id="map-wrapper">
    <div id="map" class="map" />
    <div id="popup">
      <div>
        <div v-for="feature in selectedFeatures" :key="feature.username">
          {{feature.username}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import Overlay from 'ol/Overlay'
import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Collection from 'ol/Collection'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style'
import { boundingExtent } from 'ol/extent'
import 'ol/ol.css'

const styles = {
  '10': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  '20': new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  })
}

// Popup showing the position the user clicked
// const popup = new Overlay({
//   element: document.getElementById('popup')
// })

export default {
  props: ['items'],
  data() {
    return {
      map: null,
      view: new View({
         projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 2,
      }),
      usersLayer: new VectorLayer({
        source: new VectorSource({
          features: this.features
        }),
        style: function(feature) {
          return styles['10']
        }
      }),
      selectedFeatures: []
    }
  },
  mounted() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.usersLayer
      ],
      view: this.view
    })

    //this.map.addOverlay(popup)
    // ouverture d'une popup avec les éléments cliqués
    const self = this
    this.map.on('singleclick', function(e) {
      let hit = false
      let allFeatureAtPixel = []
      self.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        hit = true
        allFeatureAtPixel.push({
          feature,
          layer
        })
      }, {
        hitTolerance: 10
      })
      if (allFeatureAtPixel.length > 0) {
        console.log(e.pixel)
        console.log(allFeatureAtPixel)
        self.selectedFeatures = allFeatureAtPixel.map(f => f.feature.get('properties'))
        console.log(self.selectedFeatures)
        //let coordinates = allFeatureAtPixel[0].feature.getGeometry().getCoordinates();
        const popup = document.getElementById('popup')
        popup.style.top = (e.pixel[1] - (self.selectedFeatures.length * 30) / 2) + 'px'
        popup.style.left = (e.pixel[0] - 75) + 'px'
        popup.style.height = (self.selectedFeatures.length * 30) + 'px'
        popup.style.display = 'block'
      } else {
        self.selectedFeatures = []
        popup.style.display = 'none'
      }
    })
  },
  computed: {
    features() {
      let features = []
      this.items.filter(i => i.latitude !== undefined).forEach(i => {
        features.push(
          new Feature({
            geometry: new Point([i.longitude, i.latitude]),
            properties: {
              username: i.username
            }
          })
        )
      })
      this.setFeatures(features)
      return features
    },
  },
  methods: {
    setFeatures(features) {
      this.usersLayer.getSource().clear()
      this.usersLayer.getSource().addFeatures(features)
      if (features.length > 0) {
        this.view.fit(this.usersLayer.getSource().getExtent(), this.map.getSize())
      }
      if(this.view.getZoom() > 15) {
        this.view.setZoom(15)
      }
    }
  },
}

</script>

<style>
  #map-wrapper,
  #map {
    position: relative;
  }

  #popup {
    position: absolute;
    z-index: 100;
    background-color: black;
    border: 1px solid #ccc;
    color: #fff;
    padding: 5px;
    font-size: 18px;
    width: 150px;
    pointer-events: none;
    display: none;
  }

  #popup > div {
    position: relative;
  }

</style>