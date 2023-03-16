import { Button, Popover } from 'antd'
import { Overlay } from 'ol'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './App.css'
import { renderOLMap } from './component/map'

function App () {
  const [buttons, setButtons] = useState(<></>)
  const buttonRef: any = React.useRef(<></>)

  useEffect(() => {
    renderOLMap().then((map) => {
      const popover = (
        <Popover content={<div>这是一个Popover！</div>} title="Title" trigger={'focus'}>
          <Button style={{
            opacity: 0,
            width: 1,
            height: 1
          }} ref={buttonRef}></Button>
        </Popover>
      )
      const popup = getPopup()
      map.addOverlay(popup)
      ReactDOM.render(popover as any, popup.getElement() as any)
      map.on('click', function (evt) {
        popup.setPosition(undefined)
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          popup.setPosition(evt.coordinate)
          console.log(buttonRef.current)

          buttonRef.current.focus()
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

      function getPopup () {
        return new Overlay({
          element: document.getElementById('popup') as HTMLElement,
          positioning: 'bottom-center',
          stopEvent: false
        })
      }
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div id="map" className="map">
          <div id='popup'></div>
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
