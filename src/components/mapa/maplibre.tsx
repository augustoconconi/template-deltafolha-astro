import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useStore } from "@nanostores/react";
import { $latlon, $imageMap } from "../../store/map";
import { point } from "@turf/helpers";
import circleTurf from "@turf/circle";
import { $SliderSelected } from "../../store/slider";
import { $StoryPage } from "../../store/stories";
import { AnnotationCallout } from "react-annotation";

import ReactDOMServer from "react-dom/server";

import "maplibre-gl/dist/maplibre-gl.css";

const annotationComponent = (
  <AnnotationCallout
    x={150}
    y={170}
    dy={117}
    dx={162}
    color={"#9610ff"}
    className="show-bg"
    editMode={true}
    note={{
      title: "Annotations :)",
      label: "Longer text to show text wrapping",
      lineType: "horizontal",
      bgPadding: { top: 15, left: 10, right: 10, bottom: 10 },
      padding: 15,
      titleColor: "#59039c",
      align: null,
    }}
    connector={{ end: "dot" }}
  />
);

const annotationHTML = ReactDOMServer.renderToString(annotationComponent);

const ArgentinaMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const latlon = useStore($latlon);
  const imageMap = useStore($imageMap);
  const slider = useStore($SliderSelected);
  const storyPage = useStore($StoryPage);

  // console.log(latlon);
  // console.log(imageMap);

  function exportMapAsImage(map: MaplibreMapType) {}

  // https://d2udmv4txj1nz3.cloudfront.net/basemaps/fsp-2023-planet/{z}/{x}/{y}.mvt

  useEffect(() => {
    if (!map) {
      const initializeMap = () => {
        const newMap = new maplibregl.Map({
          container: mapContainer.current,
          style: {
            version: 8,
            sources: {
              "raster-tiles": {
                type: "raster",
                tiles: [
                  "https://d2udmv4txj1nz3.cloudfront.net/basemaps/fsp-2023-planet/{z}/{x}/{y}.mvt",
                ],
                tileSize: 512,
              },
            },
            layers: [
              {
                id: "simple-tiles",
                type: "raster",
                source: "raster-tiles",
                minzoom: 0,
                maxzoom: 22,
              },
            ],
          },
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
          hash: false,
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
      const options = { steps: 100 };
      const circleGeoJSON = circleTurf(
        centerPoint,
        Math.sqrt(!slider ? 0.00001 : slider / Math.PI),
        options
      );

      const deforestLastYear = circleTurf(
        centerPoint,
        Math.sqrt(9001 / Math.PI),
        options
      );

      const deforestSince2015 = circleTurf(
        centerPoint,
        Math.sqrt(83196 / Math.PI),
        options
      );

      // console.log("Diâmetro " + Math.sqrt(slider / Math.PI) * 2);
      // console.log("Raio " + Math.sqrt(slider / Math.PI));

      // Verificar se a camada 'circle-layer' já existe
      const existingLayer = map.getLayer("circle-layer");
      if (existingLayer) {
        // Remover a camada 'circle-layer'
        //map.removeLayer("circle-deforest-last-year-layer");
        map.removeLayer("circle-layer");
      }

      // Verificar se a fonte 'circle-source' já existe
      const existingSource = map.getSource("circle-source");
      if (existingSource) {
        // Remover a fonte 'circle-source'
        //map.removeSource("circle-deforest-last-year");
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
            "fill-color": slider === 0 ? "#0078a4" : "transparent",
            "fill-opacity": slider === 0 ? 1 : 0.5,
            "fill-outline-color": slider === 0 ? "#0078a4" : "#0078a4",
            "fill-antialias": true,
          },
        });
      } else {
        map.addLayer({
          id: "circle-layer",
          type: "fill",
          source: "circle-source",
          paint: {
            "fill-color": "white",
            "fill-outline-color": "white",
            "fill-opacity": 0.5,
          },
        });
        // const popup = new maplibregl.Popup({ closeOnClick: false })
        //   .setLngLat([latlon.lon, latlon.lat])
        //   .setHTML(annotationHTML)
        //   .addTo(map);
      }

      if (storyPage === 2) {
        const existingLayer = map.getLayer("circle-deforest-since-2015-layer");
        if (existingLayer) {
          // Remover a camada 'circle-layer'
          map.removeLayer("circle-deforest-last-year-layer");
          map.removeLayer("circle-layer");
          map.removeLayer("circle-deforest-since-2015-layer");
        }

        // Verificar se a fonte 'circle-source' já existe
        const existingSource = map.getSource("circle-deforest-since-2015");
        if (existingSource) {
          // Remover a fonte 'circle-source'
          map.removeSource("circle-deforest-last-year");
          map.removeSource("circle-source");
          map.removeSource("circle-deforest-since-2015");
        }

        map.addSource("circle-deforest-since-2015", {
          type: "geojson",
          data: deforestSince2015,
        });

        map.addLayer({
          id: "circle-deforest-since-2015-layer",
          type: "line",
          source: "circle-deforest-since-2015",
          paint: {
            "line-width": 2, // Largura da linha do círculo
            "line-color": "red", // Cor da linha do círculo
            "line-opacity": 1, // Opacidade da linha do círculo
          },
        });
      }

      if (storyPage === 1) {
        const existingLayer = map.getLayer("circle-deforest-last-year-layer");
        if (existingLayer) {
          // Remover a camada 'circle-layer'
          map.removeLayer("circle-deforest-last-year-layer");
          map.removeLayer("circle-layer");
        }

        // Verificar se a fonte 'circle-source' já existe
        const existingSource = map.getSource("circle-deforest-last-year");
        if (existingSource) {
          // Remover a fonte 'circle-source'
          map.removeSource("circle-deforest-last-year");
          map.removeSource("circle-source");
        }

        map.addSource("circle-deforest-last-year", {
          type: "geojson",
          data: deforestLastYear,
        });

        map.addLayer({
          id: "circle-deforest-last-year-layer",
          type: "line",
          source: "circle-deforest-last-year",
          paint: {
            "line-width": 2, // Largura da linha do círculo
            "line-color": "green", // Cor da linha do círculo
            "line-opacity": 1, // Opacidade da linha do círculo
          },
        });
      }

      if (storyPage === 0) {
        const existingLayer = map.getLayer("circle-deforest-last-year-layer");
        if (existingLayer) {
          map.removeLayer("circle-deforest-last-year-layer");
          //map.removeLayer("circle-layer");
        }

        // Verificar se a fonte 'circle-source' já existe
        const existingSource = map.getSource("circle-deforest-last-year");
        if (existingSource) {
          map.removeSource("circle-deforest-last-year");
          //map.removeSource("circle-source");
        }
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

      const padding = { bottom: 200 };

      const isMobileDevice = true;
      const zoomLevel = calculateZoomForArea(slider, isMobileDevice);

      // Define o nível de zoom do mapa
      if (slider > 0 && storyPage === 0) {
        map.easeTo({
          padding,
          duration: 0,
        });
        map.flyTo({ zoom: zoomLevel });
      }

      if (storyPage === 1) {
        map.flyTo({ zoom: 7.93 });
        function print() {
          function afterIdled() {
            map.off("idle", afterIdled);

            const canvas = map.getCanvas();
            const dataURL = canvas.toDataURL("image/jpg");

            $imageMap.setKey("filename", "mapa");
            $imageMap.setKey("format", "jpg");
            $imageMap.setKey("binary", dataURL);
            map.resize();
          }

          map.on("idle", afterIdled);
          var m = map.resize();
        }

        print();
      }

      if (storyPage === 2) {
        map.flyTo({ zoom: 6.32 });
      }
    }
  }, [slider, map, latlon, storyPage]);

  return <div ref={mapContainer} className="h-[100%] w-full bg-[#202A25]" />;
};

export default ArgentinaMap;
