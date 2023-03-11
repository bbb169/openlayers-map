import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import './App.css'
import { renderOLMap } from './component/map'

function App () {
  const [buttons, setButtons] = useState(<></>)

  useEffect(() => {
    const map = renderOLMap()
    setButtons(<>
    <Button onClick={() => { zoomChange(true) }} shape='round'>+</Button>
    <Button onClick={() => { zoomChange(false) }} shape='round'>-</Button>
    </>)

    function zoomChange (zoomOut: Boolean) {
      const view = map.getView()
      const zoom = view.getZoom()
      zoom && view.setZoom(zoomOut ? zoom - 1 : zoom + 1)
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div id="map" className="map"></div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {buttons}
        </div>
        <div id="info">{buttons}&nbsp;<br/>&nbsp;</div>
      </header>
    </div>
  )
}

export default App
