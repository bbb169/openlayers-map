/* eslint-disable quote-props */
import { Map, View } from 'ol'
import '../styles/Map.css'
import XYZ from 'ol/source/XYZ.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { createXYZ } from 'ol/tilegrid.js'
import { fromLonLat } from 'ol/proj.js'
import { tile as tileStrategy } from 'ol/loadingstrategy.js'
import VectorSource from 'ol/source/Vector.js'
import EsriJSON from 'ol/format/EsriJSON.js'
import { Pixel } from 'ol/pixel'
import { Extent } from 'ol/extent'

const serviceUrl = 'https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/' +
  'Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/'
const layer = '0'
const fillColors: Record<string, number[]> = {
  'Lost To Sea Since 1965': [0, 0, 0, 1],
  'Urban/Built-up': [104, 104, 104, 1],
  'Shacks': [115, 76, 0, 1],
  'Industry': [230, 0, 0, 1],
  'Wasteland': [230, 0, 0, 1],
  'Caravans': [0, 112, 255, 0.5],
  'Defence': [230, 152, 0, 0.5],
  'Transport': [230, 152, 0, 1],
  'Open Countryside': [255, 255, 115, 1],
  'Woodland': [38, 115, 0, 1],
  'Managed Recreation/Sport': [85, 255, 0, 1],
  'Amenity Water': [0, 112, 255, 1],
  'Inland Water': [0, 38, 115, 1]
}

export function renderOLMap () {
  const mapDom = document.getElementById('map')
  if (mapDom?.innerHTML) (mapDom).innerHTML = ''

  const style = new Style({
    fill: new Fill(),
    stroke: new Stroke({
      color: [0, 0, 0, 1],
      width: 0.5
    })
  })

  const vectorSource = new VectorSource({
    format: new EsriJSON(),
    url: vectorSourceUrl,
    strategy: tileStrategy(
      createXYZ({
        tileSize: 512
      })
    ),
    attributions:
          'University of Leicester (commissioned by the ' +
          '<a href="https://www.arcgis.com/home/item.html?id=' +
          'd5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)'
  })

  const vector = new VectorLayer({
    source: vectorSource,
    style: vectorStyle,
    opacity: 0.7
  })

  const raster = new TileLayer({
    source: new XYZ({
      attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    })
  })

  const map = new Map({
    layers: [raster, vector],
    target: mapDom as HTMLElement,
    view: new View({
      center: fromLonLat([1.72, 52.4]),
      zoom: 14
    }),
    controls: []
  })

  map.on(['click', 'pointermove'], function (evt: any) {
    if (evt.dragging) {
      return
    }
    displayFeatureInfo(evt.pixel)
  })

  return map

  function displayFeatureInfo (pixel: Pixel) {
    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature
    })
    const infoDom = document.getElementById('info') as HTMLElement
    const target = map.getTarget() as HTMLElement
    if (!infoDom || !target) return
    if (feature) {
      const info =
            '2014 Land Use: ' +
            feature.get('LU_2014') +
            '<br>1965 Land Use: ' +
            feature.get('LU_1965')
      infoDom.innerHTML = info
      target.style.cursor = 'pointer'
    } else {
      infoDom.innerHTML = '&nbsp;<br>&nbsp;'
      target.style.cursor = ''
    }
  }

  function vectorStyle (feature: { get: (arg0: string) => any }) {
    const classify = feature.get('LU_2014')
    const color = fillColors[classify] || [0, 0, 0, 0]
    style.getFill().setColor(color)
    return style
  }
}

function vectorSourceUrl (extent: Extent, resolution: number, projection: import('ol/proj/Projection.js').default) {
  // ArcGIS Server only wants the numeric portion of the projection ID.
  const srid = projection
    .getCode()
    .split(/:(?=\d+$)/)
    .pop()

  const url =
      serviceUrl +
      layer +
      '/query/?f=json&' +
      'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
      encodeURIComponent(
        '{"xmin":' +
          extent[0] +
          ',"ymin":' +
          extent[1] +
          ',"xmax":' +
          extent[2] +
          ',"ymax":' +
          extent[3] +
          ',"spatialReference":{"wkid":' +
          srid +
          '}}'
      ) +
      '&geometryType=esriGeometryEnvelope&inSR=' +
      srid +
      '&outFields=*' +
      '&outSR=' +
      srid

  return url
}
