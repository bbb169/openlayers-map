import { Feature, Map, View } from 'ol'
import '../styles/Map.css'
import XYZ from 'ol/source/XYZ.js'
import { Tile as TileLayer } from 'ol/layer.js'
import { Geometry, Point } from 'ol/geom'
import { treeDot } from '../utils/data-info'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style.js'

export async function renderOLMap () {
  const treesLayer = await getDotsLayer()
  const map = getMap()
  map.addLayer(treesLayer)
  return map
}

async function getDotsLayer () {
  return fetch('http://152.136.254.142:5000/api/gettrees').then(async (res) => {
    const dots = (await res.json()).treeinfo as treeDot[]

    const features: Array<Feature<Geometry>> = []
    dots.forEach(e => {
      const treesFeature = new Feature()
      treesFeature.setGeometry(new Point([e.x, e.y], 'XY'))
      treesFeature.setStyle(getStylesByStatus(e.isused).point)
      features.push(treesFeature)
    })
    return featuresToLayer(features)
  })
}

function featuresToLayer (features: Array<Feature<Geometry>>) {
  const source = new VectorSource()
  features.forEach(e => source.addFeature(e))

  const layer = new VectorLayer()
  layer.setSource(source)

  return layer
}

function getMap () {
  return new Map({
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'http://t1.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d49f2500d194b59fd2fb57f7d00dc891'
        }),
        properties: {
          name: 'basemap'
        }
      }),
      new TileLayer({
        source: new XYZ({
          url: 'http://t1.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d49f2500d194b59fd2fb57f7d00dc891'
        }),
        properties: {
          name: 'marker'
        }
      })
    ],
    target: document.getElementById('map') as HTMLElement,
    view: new View({
      projection: 'EPSG:4326',
      center: [110.32469, 20.06039],
      minZoom: 5,
      zoom: 16
    }),
    controls: []
  })
}

function getStylesByStatus (status: boolean) {
  const styles: { line: Style[], point: Style[] } = { line: [], point: [] }
  const color = status ? [20, 224, 175] : [245, 108, 108]
  const white = [255, 255, 255]
  const width = status ? 3 : 6
  styles.line = [
    new Style({
      stroke: new Stroke({
        color: color,
        width: width + 2
      })
    }),
    new Style({
      stroke: new Stroke({
        color: white,
        width: 1
      })
    })
  ]

  styles.point = [
    new Style({
      image: new Circle({
        radius: width * 2,
        fill: new Fill({
          color: color
        }),
        stroke: new Stroke({
          color: white,
          width: 1
        })
      }),
      zIndex: Infinity
    })
  ]

  return styles
}
