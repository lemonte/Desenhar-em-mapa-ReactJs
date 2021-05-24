import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Rectangle, Circle, Polygon } from "react-google-maps"
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

const google = window.google = window.google ? window.google : {}
export const Mapa = compose(
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
      onCircleComplete={(e) => {
        return props.onChangeCircle({
          type: "Feature",
          geometry: { 'type': 'circle', 'center': e.center, 'radius': e.radius },
          properties: { 'color': props.color }
        })
      }}
      onPolygonComplete={(e) => {
        return props.onChangePolygon({
          type: "Feature",
          geometry: { 'type': 'polygon' },
          properties: { 'color': props.color },
          item: e
        })
      }}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
      }}
    />
    {
      props.circle.map(item =>
        <Circle
          key={item.id}
          onClick={() => props.onChangeItem(item)}
          center={item.geometry.center}
          radius={item.geometry.radius}
          options={{ fillColor: item.properties.color, fillOpacity: 1}}
        />
      )
    }
    {
      props.polygon.map((item, index) => {
        return <Polygon
          key={index}
          onClick={() => props.onChangeItem(item)}
          paths={item.geometry.path}
          options={{ fillColor: item.properties.color, fillOpacity: 1 }}
        />
      }
      )
    }
  </GoogleMap>
);