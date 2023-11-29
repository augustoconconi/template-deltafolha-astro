import React, { Children, cloneElement, useRef } from "react";
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Keyboard,
  Mousewheel,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";

import pako from "pako";

import "leaflet/dist/leaflet.css";

import { useStore } from "@nanostores/react";
import { $StoryData, $Story } from "../../store/stories";
import Infographic from "../charts/Infographic";

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

const slides = [
  {
    type: "cover",
    latitude: -14.4318967,
    longitude: -53.4395302,
    latlon: [-10.4318967, -52.4395302],
    zoom: 3.5,
    highlight: [],
    text: null,
  },
  // {
  //   latitude: -14.4318967,
  //   longitude: -53.4395302,
  //   latlon: [-10.4318967, -52.4395302],
  //   zoom: 3.5,
  //   highlight: [],
  //   text: "A região do semiárido sofre constantemente com a escassez de água",
  // },
  {
    latitude: -14.4318967,
    longitude: -53.4395302,
    latlon: [-16.1064614, -42.8740475],
    zoom: 5,
    highlight: [],
    dataset: "embrapa",
    text: `A Embrapa Territorial classificou municípios do semiárido conforme a vulnerabilidade à seca: <span data-status="muitoalto">muito alta</span>, <span data-status="alto">alta</span>, <span data-status="medio">média</span>, <span data-status="baixo">baixa</span> e <span data-status="muitobaixo">muito baixa</span>`,
  },
  {
    latlon: [-16.1064614, -42.8740475],
    zoom: 5,
    highlight: [""],
    dataset: "reservatorios",
    text: "Mas a <b>distribuição de reservatórios</b> não seguiu os mesmos critérios de demanda em 2022, ano eleitoral. Os municípios acima foram os beneficiados",
  },
  {
    latlon: [-8.8657268, -38.3749694],
    zoom: 6,
    highlight: [],
    dataset: "embrapa-alto",
    text: `Esses são os 228 municípios do Nordeste com vulnerabilidade <span data-status="alto">alta</span> ou <span data-status="muitoalto">muito alta</span> ...`,
  },
  {
    latlon: [-8.8657268, -38.3749694],
    zoom: 6,
    highlight: [],
    dataset: "embrapa-reservatorios-alto",
    text: `... mas 201 <span style="font-weight: bold;padding: 2%;border-radius: 5px;line-height: 35px;background-color:#055641;color:#fff;text-wrap:nowrap;">não receberam</span> cisternas nem reservatórios em 2022. Apenas 27 cidades <span style="font-weight: bold;padding: 2%;border-radius: 5px;line-height: 35px;background-color:#3C9E8E;color:#fff;text-wrap:nowrap;">receberam</span> algum dos equipamentos`,
  },
  {
    latlon: [-13.8203173, -42.4711949],
    zoom: 6,
    highlight: [""],
    dataset: "reservatorios",
    text: "A Codevasf, uma das responsáveis pela distribuição de recursos contra a seca, priorizou locais com menor necessidade, como no centro-sul e oeste da <b>Bahia</b>, que recebeu 98% dos reservatórios no ano",
  },

  {
    latlon: [-9.3882062, -37.3696565],
    zoom: 8,
    highlight: ["2705002", "2700102"],
    dataset: "empty",
    text: `<b>Água Branca</b> e <b>Mata Grande</b>, em Alagoas, são exemplos de municípios com vulnerabilidade <span data-status="muitoalto">muito alta</span> que não ganharam nenhum reservatório ou cisterna em 2022`,
  },
  {
    latlon: [-14.2171557, -44.3294956],
    zoom: 6,
    highlight: ["2910776"],
    dataset: "empty",
    text: `<b>Feira da Mata</b> (BA) tem 5.631 habitantes e recebeu 2.147 reservatórios. Ela foi classificada entre as cidades de vulnerabilidade <span data-status="muitobaixo">muito baixa</span>`,
  },
  {
    type: "ending",
    latlon: [-16.1064614, -42.8740475],
    zoom: 5,
    highlight: [""],
    dataset: "empty",
    text: `O contraste entre as áreas ignoradas e as abastadas é um efeito direto do avanço das emendas parlamentares.<br/><br/>
    Os recursos são enviados para áreas indicadas por deputados e senadores, e não necessariamente para locais de maior necessidade`,
  },
];

const mapSettings = {
  latitude: "-14.4318967",
  longitude: "-53.4395302",
  zoom: 4,
  highlight: ["2100055"],
};

function SwiperWrapper({ children }) {
  const storyIndex = useStore($Story);
  const mapRef = useRef(null);

  function MyComponent() {
    const slide = slides[storyIndex];
    const map = useMap();
    map.setView(slide?.latlon, slide?.zoom, { animate: true, duration: 1.5 });
    return null;
  }

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
    if (slides[storyIndex]?.highlight.includes(feature.properties.cod_ibge)) {
      switch (feature.properties.prioridade) {
        case "MUITO ALTO":
          return {
            fillColor: "#B44034",
            color: "#fff",
            weight: 2,
            fillOpacity: 1,
            opacity: 0.5,
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
            fillColor: "#fff",
            color: "#ccc",
            weight: 1,
            opacity: 0.3,
            fillOpacity: 1,
          };
      }
    }
    if (slides[storyIndex].dataset === "embrapa-alto") {
      if (feature.properties.prioridade === "MUITO ALTO") {
        return {
          fillColor: "#B44034",
          color: "#B44034",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (feature.properties.prioridade === "ALTO") {
        return {
          fillColor: "#F6B09D",
          color: "#F6B09D",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
    }
    if (slides[storyIndex].dataset === "embrapa-reservatorios-alto") {
      if (
        !feature.properties.reservatorios_2022 &&
        !feature.properties.cisternas_2022 &&
        feature.properties.prioridade === "MUITO ALTO"
      ) {
        return {
          fillColor: "#055641",
          color: "#055641",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (
        !feature.properties.reservatorios_2022 &&
        !feature.properties.cisternas_2022 &&
        feature.properties.prioridade === "ALTO"
      ) {
        return {
          fillColor: "#055641",
          color: "#055641",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
      if (
        feature.properties.prioridade === "ALTO" ||
        feature.properties.prioridade === "MUITO ALTO"
      ) {
        return {
          fillColor: "#3C9E8E",
          color: "#3C9E8E",
          weight: 1,
          fillOpacity: 1,
          opacity: 1,
        };
      }
    }
    if (slides[storyIndex].dataset === "reservatorios") {
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
    if (slides[storyIndex].dataset === "embrapa") {
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
            fillColor: "#fff",
            color: "#ccc",
            weight: 1,
            opacity: 0.3,
            fillOpacity: 1,
          };
      }
    } else
      return {
        fillColor: "#fff",
        color: "#ccc",
        weight: 1,
        opacity: 0.3,
        fillOpacity: 1,
      };
  }

  const onEachFeature = (feature, layer) => {
    if (feature.properties.highlight) {
      layer.setStyle(highlightStyle);
    } else {
      layer.setStyle(defaultStyle);
    }
  };

  return (
    <div className="relative sm:flex sm:flex-row">
      <div className="absolute top-0 bottom-0 sm:max-w-full m-auto h-[42em] w-full">
        <MapContainer
          center={slides[storyIndex]?.latlon}
          zoom={slides[storyIndex]?.zoom}
          zoomControl={false}
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
          <MyComponent />

          <GeoJSON data={mapFiles["al"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["ba"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["ce"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["ma"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["mg"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["pb"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["pe"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["pi"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["rn"]} style={getCityStyle} />
          <GeoJSON data={mapFiles["se"]} style={getCityStyle} />
          <GeoJSON data={geoBrazilStates} style={statesStyle} />

          {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        </MapContainer>
      </div>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        direction={"horizontal"}
        modules={[
          Navigation,
          Pagination,
          Scrollbar,
          A11y,
          Keyboard,
          Mousewheel,
          EffectFade,
        ]}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        effect="slide"
        cssMode={false}
        keyboard={true}
        mousewheel={true}
        className="absolute top-0 bottom-0 sm:max-w-full m-auto h-[42em] w-full"
        onSlideChange={(swiper) => $Story.set(swiper.activeIndex)}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {slides.map((slide, index) => {
          if (slide.type === "cover") {
            return (
              <SwiperSlide key={index}>
                <div className="m-auto bg-white h-full px-3">
                  <div className="translate-y-52 flex flex-col gap-2 sm:max-w-sm sm:pl-14">
                    <h1 className="font-black uppercase text-6xl leading-[58px] max-w-[32rem]">
                      O esquema da água
                    </h1>
                    <p className="my-5 max-w-[320px]">
                      Uso político de reservatórios e cisternas aprofunda
                      desigualdade do acesso à água em regiões de seca
                    </p>
                    <span class="relative flex h-6 w-6">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0078a4] opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-6 w-6 bg-[#0078a4] opacity-5"></span>
                    </span>
                    <div className="flex gap-0 text-[#929292] -translate-x-1 -translate-y-10 text-sm my-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="22"
                        viewBox="0 0 33 42"
                        fill="none"
                      >
                        <path
                          d="M15.25 0C18.2833 0 20.875 1.05833 23.025 3.175C25.175 5.29167 26.25 7.86667 26.25 10.9C26.25 12.6333 25.875 14.2667 25.125 15.8C24.375 17.3333 23.3167 18.6333 21.95 19.7H20.25V17.2C21.2167 16.4333 21.9583 15.5 22.475 14.4C22.9917 13.3 23.25 12.1333 23.25 10.9C23.25 8.7 22.4667 6.83333 20.9 5.3C19.3333 3.76667 17.45 3 15.25 3C13.05 3 11.1667 3.76667 9.6 5.3C8.03334 6.83333 7.25 8.7 7.25 10.9C7.25 12.1333 7.50834 13.3 8.025 14.4C8.54167 15.5 9.28334 16.4333 10.25 17.2V20.8C8.38334 19.8333 6.91667 18.4667 5.85 16.7C4.78334 14.9333 4.25 13 4.25 10.9C4.25 7.86667 5.325 5.29167 7.475 3.175C9.625 1.05833 12.2167 0 15.25 0ZM13.35 42C12.7833 42 12.25 41.8917 11.75 41.675C11.25 41.4583 10.8167 41.1667 10.45 40.8L0.150002 30.5L2.95 27.6C3.41667 27.1333 3.94167 26.775 4.525 26.525C5.10834 26.275 5.71667 26.2333 6.35 26.4L10.25 27.3V11C10.25 9.6 10.7333 8.41667 11.7 7.45C12.6667 6.48333 13.85 6 15.25 6C16.65 6 17.8333 6.48333 18.8 7.45C19.7667 8.41667 20.25 9.6 20.25 11V19.6H21.55C21.7167 19.6 21.8667 19.6333 22 19.7C22.1333 19.7667 22.2833 19.8333 22.45 19.9L29.85 23.5C30.65 23.8667 31.2417 24.4583 31.625 25.275C32.0083 26.0917 32.1167 26.9333 31.95 27.8L30.15 38.7C29.9833 39.6667 29.5167 40.4583 28.75 41.075C27.9833 41.6917 27.1167 42 26.15 42H13.35ZM12.95 39H27L29.15 26.55L20 22H17.25V11C17.25 10.4 17.0667 9.91667 16.7 9.55C16.3333 9.18333 15.85 9 15.25 9C14.65 9 14.1667 9.18333 13.8 9.55C13.4333 9.91667 13.25 10.4 13.25 11V30.95L5.55 29.3L4.4 30.45L12.95 39Z"
                          fill="#929292"
                        ></path>
                      </svg>
                      <p>Deslize para navegar entre os slides</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          }
          if (!slide.text)
            return (
              <SwiperSlide key={index}>
                <div className="max-w-sm m-auto px-3"></div>
              </SwiperSlide>
            );
          if (slide.type === "ending") {
            return (
              <SwiperSlide key={index}>
                <div className="max-w-sm m-auto px-3">
                  <div className="bg-[#f7f7f7] border-slate-100 shadow-lg translate-y-[230px] bottom-0 px-5 py-4 rounded-md">
                    <p
                      className="text-center"
                      dangerouslySetInnerHTML={{ __html: slide.text }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          }
          return (
            <SwiperSlide key={index}>
              <div className="max-w-sm m-auto px-3">
                <div className="bg-[#f7f7f7] border-slate-200 shadow-2xl translate-y-[480px] bottom-0 px-5 py-4 rounded-md">
                  {/* <div className="-translate-y-4 translate-x-[20rem] -m-3 bg-red-100 border-slate-200 shadow-2xl h-7 w-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div> */}
                  <p
                    className="text-center"
                    dangerouslySetInnerHTML={{ __html: slide.text }}
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default SwiperWrapper;
