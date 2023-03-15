import { Button, Popover } from 'antd'
import { Overlay } from 'ol'
import React, { useEffect, useState } from 'react'
import './App.css'
import { renderOLMap } from './component/map'

function App () {
  const [buttons, setButtons] = useState(<></>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [layerPopover, setLayerPopover] = useState(
  <Popover placement="top" title={'any'} content={'any'} trigger="hover" open={true}>
    <div id="popup"></div>
  </Popover>)

  useEffect(() => {
    renderOLMap().then((map) => {
      const popup = getPopup(null)
      console.log(popup)

      map.addOverlay(popup)
      map.on('click', function (evt) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          map.removeOverlay(popup)
          map.addOverlay(getPopup(evt.coordinate))
          // setLayerPopover(
          // <Popover placement="top" title={'any'} content={'any'} open={true}>
          //   <div id="popup"></div>
          // </Popover>
          // )

          return feature
        })
      })

      setButtons(<>
        <Button onClick={() => { zoomChange(true) }} shape='round'>+</Button>
        <Button onClick={() => { zoomChange(false) }} shape='round'>-</Button>
        </>)

      function zoomChange (zoomOut: Boolean) {
        const view = map.getView()
        const zoom = view.getZoom()
        zoom && view.setZoom(zoomOut ? zoom - 1 : zoom + 1)
      }

      function getPopup (position: number[] | null) {
        const popup = new Overlay({
          element: document.getElementById('popup') as HTMLElement,
          positioning: 'bottom-center',
          stopEvent: false
        })
        position && popup.setPosition(position)
        return popup
      }
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div id="map" className="map">
          {layerPopover}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {buttons}
        </div>
        <div id="info">&nbsp;<br/>&nbsp;</div>
      </header>
    </div>
  )
}

export default App
