import { useEffect, useState } from "react";
import { SketchPicker } from 'react-color';
import { create_data, delete_data, request_data, update_data } from "./requests";
import M from 'materialize-css'
import { Mapa } from "./components/mapa";
import "./App.css"




function App() {
  const [item_open, setItem] = useState([])
  const [color, setColor] = useState("#FFF")
  const [polygon, setPolygon] = useState([]);
  const [circle, setCircle] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    request();
  }, [])



  useEffect(() => {
    map_component()
  }, [polygon, circle, color])

  useEffect(() => {
    map_component()
  })

  async function request() {
    setLoading(true)
    setCircle([])
    setPolygon([])
    const results = await request_data()
    if (!results) return M.toast({ html: "Erro na consulta" })
    results.map(item => {
      if (item.geometry.type == "circle") {
        let lista = circle;
        lista.push(item);
        return setCircle(lista);
      }
      if (item.geometry.type == "polygon") {
        let lista = polygon;
        lista.push(item);
        return setPolygon(lista);
      }
    })
    return setLoading(false)
  }

  function change_color(color) {
    if (item_open.id) {
      if (item_open.geometry.type == "circle") return circle.map(item => { if (item == item_open) { item.properties.color = color.hex; return change_item(item) } });
      if (item_open.geometry.type == 'polygon') return polygon.map(item => { if (item == item_open) { item.properties.color = color.hex; return change_item(item) } });
    }
    else {
      var lista = []
      let item = []
      if (item_open.geometry.type == 'polygon') { lista = polygon; }
      if (item_open.geometry.type == "circle") { lista = circle }
      const find_circle = lista.findIndex(item => item == item_open)
      if (find_circle == -1) { item = item_open }
      else { item = lista[find_circle] }
      item.properties.color = color.hex;
      lista.push(item)
      setCircle(lista)
      return change_item(item)
    }
  }


 async function remove_item() {
    await delete_data(item_open.id)
    return window.location.reload()
  }

  function change_polygon(item) {
    const path = item.item
      .getPath()
      .getArray()
      .map(latLng => {
        return { lat: latLng.lat(), lng: latLng.lng() };
      });
    item.geometry.path = path;
    item.item = null
    return setItem(item)
  }

  function change_item(item) {
    setItem(item)
    return setColor(item.properties.color)
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
    if (loading) return (
      <div class="div-loader white">
        <div class="c-loader"></div>
      </div>
    )
    return (
      <Mapa
        onChangeItem={change_item}
        color={color}
        polygon={polygon}
        circle={circle}
        item={item_open}
        onChangeCircle={setItem}
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
                  width="90%"
                />
              </div>

            </div>
            <div class="card-action center">
              <a href="#"
                onClick={async () => {
                  if (item_open.id) { await update_data(item_open) }
                  else { await create_data(item_open) }
                  return request()
                }}
              >Salvar</a>
              {item_open.id ? <a href="#" onClick={() => { remove_item(); return map_component() }} >Descartar</a> : null}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;