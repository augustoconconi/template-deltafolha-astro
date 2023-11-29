import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useStore } from "@nanostores/react";
import { $latlon } from "../../store/map";
import { point } from "@turf/helpers";
import circleTurf from "@turf/circle";
import { $SliderSelected } from "../../store/slider";

import "maplibre-gl/dist/maplibre-gl.css";

const ArgentinaMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  // const [mapData, setMapData] = useState(null);
  // const [selectedItem, setSelectedItem] = useState(0);
  // const [onselect, setOnselect] = useState({});
  const latlon = useStore($latlon);
  const slider = useStore($SliderSelected);

  // console.log(latlon);
  // console.log(slider);

  useEffect(() => {
    if (!map) {
      const initializeMap = () => {
        const newMap = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json`,
          center: [-74.5, 40],
          // maxBounds: [
          //   [-75, -55], // Southwestern coordinates of the bounding box
          //   [-53, -20], // Northeastern coordinates of the bounding box
          // ],
          zoom: 17,
          dragPan: true,
          scrollZoom: true,
          doubleClickZoom: false,
          touchZoomRotate: false,
          hash: true,
        });

        newMap.on("load", () => {
          setMap(newMap);
        });

        newMap.on("style.load", function () {
          var layers = newMap.getStyle().layers;
          layers.forEach(function (layer) {
            if (layer.type === "symbol" && layer.layout["text-field"]) {
              //newMap.setLayoutProperty(layer.id, "visibility", "none");
            }
          });
        });

        newMap.addControl(
          new maplibregl.AttributionControl({
            compact: true, // Mantém a exibição não compacta em dispositivos móveis
          })
        );

        // Add event listeners or any other configurations as needed for the map
      };

      initializeMap();
    }
  }, [map]);

  useEffect(() => {
    if (map && latlon.lon && latlon.lat) {
      map.flyTo({
        center: [latlon.lon, latlon.lat],
        zoom: 17,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
      // Atualizar o valor do círculo quando o slider for alterado
      const centerPoint = point([latlon.lon, latlon.lat]);
      const options = { steps: 50 };
      const circleGeoJSON = circleTurf(
        centerPoint,
        Math.sqrt(!slider ? 0.00001 : slider / Math.PI),
        options
      );

      // console.log("Diâmetro " + Math.sqrt(slider / Math.PI) * 2);
      // console.log("Raio " + Math.sqrt(slider / Math.PI));

      // Verificar se a camada 'circle-layer' já existe
      const existingLayer = map.getLayer("circle-layer");
      if (existingLayer) {
        // Remover a camada 'circle-layer'
        map.removeLayer("circle-layer");
      }

      // Verificar se a fonte 'circle-source' já existe
      const existingSource = map.getSource("circle-source");
      if (existingSource) {
        // Remover a fonte 'circle-source'
        map.removeSource("circle-source");
      }

      // Adicionar a nova fonte e camada do círculo
      map.addSource("circle-source", {
        type: "geojson",
        data: circleGeoJSON,
      });

      if (slider === 0) {
        map.addLayer({
          id: "circle-layer",
          type: "fill",
          source: "circle-source",
          paint: {
            "fill-color": slider === 0 ? "blue" : "transparent",
            "fill-opacity": slider === 0 ? 1 : 0.5,
            "fill-outline-color": slider === 0 ? "blue" : "blue",
            "fill-antialias": true,
          },
        });
      } else {
        map.addLayer({
          id: "circle-layer",
          type: "line",
          source: "circle-source",
          paint: {
            "line-width": 2, // Largura da linha do círculo
            "line-color": "blue", // Cor da linha do círculo
            "line-opacity": 1, // Opacidade da linha do círculo
          },
        });
      }

      const calculateZoomForArea = (area, isMobile) => {
        const zoomIntervals = [
          { maxArea: 1, zoomMobile: 17, zoomDesktop: 15 },
          { maxArea: 100, zoomMobile: 11.2, zoomDesktop: 12.34 },
          { maxArea: 200, zoomMobile: 10.73, zoomDesktop: 11.84 },
          { maxArea: 300, zoomMobile: 10.42, zoomDesktop: 11.5 },
          { maxArea: 400, zoomMobile: 10.21, zoomDesktop: 11.38 },
          { maxArea: 500, zoomMobile: 10, zoomDesktop: 11.28 },
          { maxArea: 600, zoomMobile: 9.95, zoomDesktop: 11.11 },
          { maxArea: 700, zoomMobile: 9.85, zoomDesktop: 10.85 },
          { maxArea: 1000, zoomMobile: 9.58, zoomDesktop: 8 },
        ];

        // Encontra o primeiro intervalo onde a área é menor ou igual ao limite máximo
        const interval = zoomIntervals.find(
          (interval) => area <= interval.maxArea
        );

        // Retorna o nível de zoom do intervalo encontrado ou um valor padrão se nenhum intervalo for encontrado
        if (interval) {
          return isMobile ? interval.zoomMobile : interval.zoomDesktop;
        } else {
          return isMobile ? 8 : 6; // Valores de zoom padrão para áreas maiores que os intervalos definidos
        }
      };

      const isMobileDevice = false;
      const zoomLevel = calculateZoomForArea(slider, isMobileDevice);

      console.log(zoomLevel);
      // Define o nível de zoom do mapa
      if (slider > 0) {
        map.flyTo({ zoom: zoomLevel });
      }
    }
  }, [slider, map, latlon]);

  return <div ref={mapContainer} className="h-[100%] w-full bg-[#202A25]" />;
};

export default ArgentinaMap;
