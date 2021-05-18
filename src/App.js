import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Rectangle, Circle, Polygon } from "react-google-maps"
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import { useState } from "react";
import { SketchPicker } from 'react-color';

const google = window.google = window.google ? window.google : {}
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: (window.innerHeight - 64) }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    <DrawingManager
      onRectangleComplete={(e) => {
        return props.onChangeRectangle({
          'type': 'rectangle',
          'bound': e.bounds,
          'color': props.color,
          'item': e
        })
      }}
      onCircleComplete={(e) => {
        return props.onChangeCircle({
          'type': 'circle',
          'center': e.center,
          'color': props.color,
          'radius': e.radius
        })
      }}
      onPolygonComplete={(e) => {
        return props.onChangePolygon({
          'type': 'polygon',
          'color': props.color,
          'item': e
        })
      }}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
      }}
    />
    {
      props.rectangle.map(item =>
        <Rectangle
          onClick={() => props.onChangeItem(item)}
          defaultBounds={item.bound}
          options={{ fillColor: item.color }}
        />
      )
    }
    {
      props.circle.map(item =>
        <Circle
          onClick={() => props.onChangeItem(item)}
          center={item.center}
          radius={item.radius}
          options={{ fillColor: item.color }}
        />
      )
    }
    {
      props.polygon.map(item =>
        <Polygon
          onClick={() => props.onChangeItem(item)}
          paths={item.path}
          options={{ fillColor: item.color }}
        />
      )
    }
  </GoogleMap>
);



function App() {
  const [item_open, setItem] = useState([])
  const [color, setColor] = useState("#FFF")
  const [polygon, setPolygon] = useState([]);
  const [circle, setCircle] = useState([])
  const [rectangle, setRectangle] = useState([])

  function change_color(color) {
    if (item_open.type == "circle") return circle.map(item => { if (item == item_open) { item.color = color.hex; return change_item(item) } });
    if (item_open.type == 'polygon') return polygon.map(item => { if (item == item_open) { item.color = color.hex; return change_item(item) } });
    if (item_open.type == 'rectangle') return rectangle.map(item => { if (item == item_open) { item.color = color.hex; return change_item(item) } });
    return setColor(color.hex)
  }

  function change_rectangle(item) {
    setItem(item)
    rectangle.push(item)
    return setRectangle(rectangle)
  }

  function change_circle(item) {
    setItem(item)
    circle.push(item)
    return setCircle(circle)
  }

  function remove_item() {
    if (item_open.type == "circle") return circle.splice(item_open, 1)
    if (item_open.type == 'polygon') return polygon.splice(item_open, 1)
    if (item_open.type == 'rectangle') return rectangle.splice(item_open, 1)
  }
 
  function change_polygon(item) {
    setItem(item)
    const index = polygon.findIndex(element => element.item == item.item)
    if (index > -1) {
      const path = item.item
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      polygon[index].path = path;
    }
    else {
      const path = item.item
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      item.path = path;
      polygon.push(item);
    }
    return setPolygon(polygon);
  }

  function change_item(item) {
    setItem(item)
    return setColor(item.color)
  }

  function navbar() {
    return (
      <nav>
        <div class="nav-wrapper blue indigo darken-4">
          <a href="#" class="brand-logo">Polígono</a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a href="sass.html">Sobre</a></li>
            <li><a href="collapsible.html">Sair</a></li>
          </ul>
        </div>
      </nav>
    )
  }

  function map_component() {
    return (
      <MyMapComponent
        onChangeItem={change_item}
        color={color}
        polygon={polygon}
        circle={circle}
        rectangle={rectangle}
        item={item_open}
        onChangeRectangle={change_rectangle}
        onChangeCircle={change_circle}
        onChangePolygon={change_polygon}
      />
    )
  }


  return (
    <>
      {navbar()}
      <div class="row" style={{ padding: 0, margin: 0 }} >
        <div class="col xl10 l9 m8 s12" style={{ padding: 0, margin: 0 }} >
          {map_component()}
        </div>

        <div class="col xl2 l3 m4 s12" style={{ padding: 5, margin: 0 }}>
          <div class="card center">
            <div class="card-content black-text center"
              style={{ padding: 0, margin: 0 }}>
              <span class="card-title">Sobre o Poligono</span>
              <div class="center">
                <SketchPicker
                  onChangeComplete={change_color}
                  color={color}
                />
              </div>

            </div>
            <div class="card-action center">
              <a href="#">Salvar</a>
              <a href="#" onClick={() => { remove_item(); return map_component()}} >Descartar</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;