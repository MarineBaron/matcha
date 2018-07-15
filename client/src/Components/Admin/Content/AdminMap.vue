<template>
  <div id="map-wrapper">
    <div id="map" class="map" />
    <div id="popup">
      <div>
        <div v-for="feature in selectedFeatures" :key="feature.username">
          <user-list-item
            :item="feature.user"
            actor="admin"
            :actions="['view']"
          />
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

import UserListItem from '../../User/All/UserListItem.vue'

const styles = {
  'bot': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'grey'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  'me': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'blue'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  'friend': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'green'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  'liker': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'purple'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  'liked': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'orange'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  'other': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'black'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  }),
  'all': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'white'}),
      stroke: new Stroke({color: '#bada55', width: 1})
    })
  })
}

export default {
  components: {
    UserListItem
  },
  props: ['status','items'],
  data() {
    return {
      map: null,
      hitTolerance: 5,
      //features: [],
      selectedFeatures: [],
      center: [1, 42],
      zoom: 5,
      names: []
    }
  },
  mounted() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
         projection: 'EPSG:4326',
        center: this.center,
        zoom: this.zoom,
      }),
    })

    const names = ['all','bot', 'me', 'friend', 'liker', 'liked', 'other']
    names.forEach(name => {
      const layer = new VectorLayer({
        name: name,
        source: new VectorSource(),
        style: function(feature) {
          return styles[name]
        }
      })
      if (name === 'all') {
        layer.setVisible(false)
      } else {
        this.names.push(name)
      }
      this.map.addLayer(layer)
    })

    const self = this
    // cursor on features
    this.map.on('pointermove', function(e) {
      let hit = false
      self.map.forEachFeatureAtPixel(e.pixel, function() {
        hit = true
      }, {
        hitTolerance: self.hitTolerance
      })
      self.map.getViewport().style.cursor = hit ? 'pointer' : ''
    })
    // click on features
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
        hitTolerance: self.hitTolerance
      })
      if (allFeatureAtPixel.length > 0) {
        self.selectedFeatures = allFeatureAtPixel.map(f => f.feature.get('properties'))
        const popup = document.getElementById('popup')
        popup.style.top = (e.pixel[1] - (self.selectedFeatures.length * 50) / 2) + 'px'
        popup.style.left = (e.pixel[0] - 75) + 'px'
        popup.style.display = 'block'
      } else {
        self.selectedFeatures = []
        popup.style.display = 'none'
      }
    })

  },
  watch: {
    status(n, o) {
      if(n !== o && n === 'success') {
        this.setFeatures()
      }
    }
  },
  methods: {
    setFeatures() {
      let features = []
      this.items.filter(i => i.latitude !== undefined).forEach(i => {
        let name = null
        if (i.username === 'admin') {
          name = 'me'
        } else if (i.bot === 'bot') {
          name = 'bot'
        }
        features.push(
          new Feature({
            name : name,
            geometry: new Point([i.longitude, i.latitude]),
            properties: {
              user: i
            }
          })
        )
      })
      const view = this.map.getView()
      const layers = this.map.getLayers()
      let layerAll
      //récupératioon des names des layers
      layers.forEach(layer => {
        if (layer.get('name') === 'all') {
          layerAll = layer
        }
      })

      //nettotage des layers
      layers.forEach(layer => {
        if(layer.get('name') !== undefined) {
          layer.getSource().clear()
        }
      })

      if(features.length) {
        // remplissage du layer all avec toutes les features
        layerAll.getSource().addFeatures(features)
        //remplissage des layers spécifiques avec les features correspondantes
        this.names.forEach(name => {
          layers.forEach(layer => {
            if(layer.get('name') === name) {
                if (name === 'other') {
                  if(features.length) {
                    layer.getSource().addFeatures(features)
                    layer.setVisible(true)
                  } else {
                    layer.setVisible(false)
                  }
                } else {
                  const featuresSelected = features.filter(f => f.get('name') === name)
                  if(featuresSelected.length) {
                    layer.getSource().addFeatures(featuresSelected)
                    features = features.filter(f => f.get('name') !== name)
                    layer.setVisible(true)
                  } else {
                    layer.setVisible(false)
                  }
                }
                //console.log(layer.get('name', layer.getSource().features.length, layer.isVisible()))
              }
            })
          })
          view.fit(layerAll.getSource().getExtent(), this.map.getSize())
          if(view.getZoom() > 15) {
            view.setZoom(15)
          }
        }

        this.featuresSelected = []
        //this.features = features
        return features
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
    border: 3px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    width: 150px;
    background-color: #fff;
    display: none;
  }

  #popup > div {
    position: relative;
  }

</style>