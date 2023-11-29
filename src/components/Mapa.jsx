import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";

const position = [-23.6794026, -46.6008514];

const onEachFeature = (feature, layer) => {
  layer.bindTooltip(
    `<div>${feature.properties["nome"]}, ID: ${feature.properties["cartodb_id"]}</div>`,
    {
      sticky: true,
    }
  );
  console.log(feature.properties);
};

const Mapa = (props) => {
  const { geojson } = props;
  console.log(geojson);
  if (!geojson) return "Sem dados";
  else
    return (
      <div>
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "620px", width: "100%", backgroundColor: "#fff" }}
          attributionControl={false}
        >
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
          <GeoJSON data={geojson} onEachFeature={onEachFeature} />
        </MapContainer>
      </div>
    );
};

export default Mapa;
