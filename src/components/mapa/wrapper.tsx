import React, { Children, cloneElement, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Circle,
  Tooltip,
  FeatureGroup,
  Popup,
} from "react-leaflet";
import pako from "pako";

import "leaflet/dist/leaflet.css";

import { useStore } from "@nanostores/react";
import { $StoryData, $Story } from "../../store/stories";

// const geoData = await fetch("http://localhost:3000/mapa.geojson").then(
//   (response) => response.json()
// );

// const geoBrazilStates = await fetch(
//   "http://localhost:3000/data/brasil.json"
// ).then((response) => response.json());

const UFs = ["al", "ba", "ce", "ma", "mg", "pb", "pe", "pi", "rn", "se"];
const dataByUF = {}; // Objeto para armazenar os dados por UF

// https://arte.folha.uol.com.br/poder/2023/09/30/story-esquema-da-agua-teste

const URL_ENDPOINT =
  "https://arte.folha.uol.com.br/poder/2023/09/30/esquema-da-agua";

async function fetchDataByUF() {
  for (const UF of UFs) {
    const url = `${URL_ENDPOINT}/data/mapa_${UF}.json`;
    const delta = await fetch(url).then((response) => response.arrayBuffer());
    const restored = JSON.parse(pako.inflate(delta, { to: "string" }));

    // Armazene os dados no objeto dataByUF com a chave sendo a UF
    dataByUF[UF] = restored;
  }

  // Agora dataByUF contém os dados de cada UF;
  return dataByUF;
}

const mapFiles = await fetchDataByUF();

const delta = await fetch(`${URL_ENDPOINT}/data/estados.json`).then(
  (response) => response.arrayBuffer()
);

const geoBrazilStates = await JSON.parse(pako.inflate(delta, { to: "string" }));

const mapSettings = {
  latitude: "-14.4318967",
  longitude: "-53.4395302",
  zoom: 4,
  highlight: ["2100055"],
};

const LegendItemLog = ({ color, label, width }) => (
  <div className="legend-item" style={{ width: width }}>
    <div className="legend-color" style={{ backgroundColor: color }}></div>
    <div className="legend-label">{label}</div>
  </div>
);

const LegendLog = ({ data, title, unidade }) => {
  const legendData = data;

  // Função para calcular a largura com base na escala logarítmica
  const calculateWidth = (value) => {
    const min = 1;
    const max = 1000;
    const minValue = Math.log10(min);
    const maxValue = Math.log10(max);
    const scaledValue = Math.log10(value);
    const width =
      ((scaledValue - minValue) / (maxValue - minValue)) * 100 + "%";
    return width;
  };

  return (
    <>
      <h2 className="font-serif text-2xl mt-2 font-semibold">{title}</h2>
      <p className="font-sans text-[12px] font-medium">{unidade}</p>
      <div className="legend">
        <div className="legend-items">
          {legendData.map((item, index) => (
            <LegendItemLog
              key={index}
              color={item.color}
              label={item.label}
              width={calculateWidth(Number(item.label.replace("+", "")))}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: color }}></div>
    <div className="legend-label">{label}</div>
  </div>
);

const Legend = ({ data, title, unidade }) => {
  return (
    <>
      <h2 className="font-serif text-2xl mt-2 font-semibold">{title}</h2>
      <p className="font-sans text-[12px] font-medium">{unidade}</p>
      <div className="legend">
        {data.map((item, index) => (
          <LegendItem key={index} color={item.color} label={item.label} />
        ))}
      </div>
    </>
  );
};

const legendColors0 = [
  { color: "#004F9F", label: "MUITO BAIXO" },
  { color: "#88BCE7", label: "BAIXO" },
  { color: "#FFEBB8", label: "MÉDIO" },
  { color: "#F6B09D", label: "ALTO" },
  { color: "#B44034", label: "MUITO ALTO" },
];

const legendColors1 = [
  { color: "#D8E9E6", label: "1" },
  { color: "#A4CCC2", label: "10" },
  { color: "#7CB6A8", label: "100" },
  { color: "#3C9E8E", label: "500" },
  { color: "#055641", label: "1000+" },
];

const legendColors2 = [
  { color: "#D8E9E6", label: "1" },
  { color: "#A4CCC2", label: "10" },
  { color: "#7CB6A8", label: "30" },
  { color: "#3C9E8E", label: "50" },
  { color: "#055641", label: "100+" },
];

function SwiperWrapper({ children }) {
  const storyIndex = useStore($Story);
  const mapRef = useRef(null);

  const tabItems = ["Nível de vulnerabilidade", "Reservatórios", "Cisternas"];
  const [selectedItem, setSelectedItem] = useState(0);
  const [onselect, setOnselect] = useState({});

  const highlightStyle = {
    fillColor: "yellow",
    color: "blue",
    weight: 2,
  };

  const defaultStyle = {
    fillColor: "#f7f7f7",
    color: "#fffff",
    weight: 0.75,
  };

  const statesStyle = {
    fillColor: "#fff",
    color: "black",
    weight: 1,
    fillOpacity: 0,
  };

  function getCityStyle(feature) {
    if (selectedItem === 2) {
      var n = parseFloat(feature.properties.cisternas_2022);
      if (n > 100) {
        return {
          fillColor: "#055641",
          color: "#055641",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 50) {
        return {
          fillColor: "#3C9E8E",
          color: "#3C9E8E",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 30) {
        return {
          fillColor: "#7CB6A8",
          color: "#7CB6A8",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 10) {
        return {
          fillColor: "#A4CCC2",
          color: "#A4CCC2",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 1) {
        return {
          fillColor: "#D8E9E6",
          color: "#D8E9E6",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
    }
    if (selectedItem === 1) {
      var n = parseFloat(feature.properties.reservatorios_2022);
      if (n > 1000) {
        return {
          fillColor: "#055641",
          color: "#055641",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 500) {
        return {
          fillColor: "#3C9E8E",
          color: "#3C9E8E",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 100) {
        return {
          fillColor: "#7CB6A8",
          color: "#7CB6A8",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 10) {
        return {
          fillColor: "#A4CCC2",
          color: "#A4CCC2",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (n > 1) {
        return {
          fillColor: "#D8E9E6",
          color: "#D8E9E6",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
    }
    if (selectedItem === 0) {
      switch (feature.properties.prioridade) {
        case "MUITO ALTO":
          return {
            fillColor: "#B44034",
            color: "#B44034",
            weight: 2,
            fillOpacity: 1,
            opacity: 1,
          };
        case "ALTO":
          return {
            fillColor: "#F6B09D",
            color: "#F6B09D",
            weight: 2,
            fillOpacity: 1,
            opacity: 1,
          };
        case "MÉDIO":
          return {
            fillColor: "#FFEBB8",
            color: "#FFEBB8",
            weight: 2,
            fillOpacity: 1,
            opacity: 1,
          };
        case "BAIXO":
          return {
            fillColor: "#88BCE7",
            color: "#88BCE7",
            weight: 2,
            fillOpacity: 1,
            opacity: 1,
          };
        case "MUITO BAIXO":
          return {
            fillColor: "#004F9F",
            color: "#004F9F",
            weight: 2,
            fillOpacity: 1,
            opacity: 1,
          };
        default:
          return {
            fillColor: "#ccc",
            color: "#ccc",
            weight: 1,
            opacity: 0,
            fillOpacity: 0,
          };
      }
    } else
      return {
        fillColor: "#fff",
        color: "#ccc",
        weight: 1,
        opacity: 0,
        fillOpacity: 0,
      };
  }

  const highlightFeature = (e) => {
    setOnselect(e.target.feature.properties);
  };
  const resetHighlight = (e) => {
    setOnselect({});
  };

  const Modal = ({ data }) => {
    if (!data.municipio) return <></>;
    return (
      <div
        className=" opacity-100 bottom-56  bg-[#f7f7f7] z-[9999]
      ] border-slate-200 shadow-2xl px-5 py-4 rounded-md relative m-auto max-w-xs translate-y-[600px]"
      >
        <h2 className="uppercase font-bold text-lg w-[180px] my-3 leading-5">
          {data.municipio} ({data.sigla_uf})
        </h2>
        {!data.prioridade ? null : (
          <p>
            Nível de vulnerabilidade:{" "}
            <span
              data-status={data.prioridade.toLowerCase()}
              style={{ lineHeight: "12px", marginTop: "4px" }}
            >
              {data.prioridade}
            </span>
          </p>
        )}
        <p className="my-2">{data.populacao.toLocaleString()} habitantes</p>
        <hr />
        <div className="flex flex-row gap-6 text-center justify-center my-2">
          <p>
            <span className="font-bold text-lg">
              {!data.cisternas_2022
                ? "0"
                : data.cisternas_2022.toLocaleString()}
            </span>
            <br />
            {data.cisternas_2022 < 2 ? "cisterna" : "cisternas"}
          </p>
          <p>
            <span className="font-bold text-lg">
              {!data.reservatorios_2022
                ? "0"
                : data.reservatorios_2022.toLocaleString()}
            </span>
            <br />
            {data.reservatorios_2022 < 2 ? "reservatório" : "reservatórios"}
          </p>
        </div>
      </div>
    );
  };

  const onEachFeature = (feature, layer) => {
    const featureData = feature.properties;
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
    const popupOptions = {
      minWidth: 100,
      maxWidth: 250,
      className: "popup-classname",
    };
  };

  function bringToBack(feature, layer) {
    layer.on({
      add: function () {
        layer.bringToBack();
      },
    });
  }

  return (
    <div className="flex flex-col">
      <div className="sm:max-w-full m-auto h-[44em] w-full bg-red-200">
        <MapContainer
          center={[-10.786946, -43.1049859]}
          bounds={[
            [
              [-55.5247538164, -23.9637054296],
              [-34.2552225664, -23.9637054296],
              [-34.2552225664, -0.6125192085],
              [-55.5247538164, -0.6125192085],
              [-55.5247538164, -23.9637054296],
            ],
          ]}
          zoom={5}
          dragging={true}
          zoomControl={true}
          scrollWheelZoom={false}
          attributionControl={false}
          ref={mapRef}
          style={{
            height: "100%",
            width: "100%",
            zIndex: 1,
            backgroundColor: "#fff",
          }}
        >
          {/* <MyComponent /> */}
          <Modal data={onselect} />
          <Tooltip>Teste</Tooltip>
          <GeoJSON
            data={mapFiles["al"]}
            style={getCityStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default SwiperWrapper;
