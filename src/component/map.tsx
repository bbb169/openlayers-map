/* eslint-disable quote-props */
import { Map, View } from 'ol'
import '../styles/Map.css'
import XYZ from 'ol/source/XYZ.js'
import { Tile as TileLayer } from 'ol/layer.js'

export async function renderOLMap () {
  const dots = await getDots()
  console.log(dots)

  const map = new Map({
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
          name: 'basemap'
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

  return map
}

function getDots () {
  return fetch('http://152.136.254.142:5000/api/gettrees').then((res) => {
    return res.json()
  })
}
