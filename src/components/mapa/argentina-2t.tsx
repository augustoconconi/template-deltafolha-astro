import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ArgentinaMap = () => {
  const [mapData, setMapData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(0);
  const [onselect, setOnselect] = useState({});

  const { data: geojsonData, error } = useSWR(
    "https://arte.folha.uol.com.br/deltafolha/2023/10/22/eleicoes-argentina/data/provs.json",
    fetcher
  );
  const { data: argentina, error: argentinaError } = useSWR(
    "https://arte.folha.uol.com.br/databases/eleicoes/argentina/2023/2-turno/json/distritos.json",
    fetcher
  );

  if (error) {
    return <div>Error ao carregar os dados.</div>;
  }

  if (!argentina) {
    return <p>Carregando ...</p>;
  }

  //   useEffect(() => {
  //     if (argentina && geojsonData) {
  //       // Crie um mapa de candidatos vencedores por província
  //       const provinceWinners = {};
  //       argentina[0].parties.forEach((party) => {
  //         const candidate = party.candidates[0];
  //         if (candidate) {
  //           provinceWinners[party.partyID] = candidate.fullName;
  //         }
  //       });

  //       // Adicione informações de vencedores ao GeoJSON
  //       const updatedGeoJSON = geojsonData.features.map((feature) => {
  //         const provinceID = feature.properties.id; // Use o ID da província para corresponder ao ID do partido
  //         const winner = provinceWinners[provinceID];
  //         feature.properties.winner = winner || "Nenhum Vencedor"; // Se não houver vencedor, defina como "Nenhum Vencedor"
  //         return feature;
  //       });

  //       setMapData(updatedGeoJSON);
  //     }
  //   }, [argentina, geojsonData]);

  const legendColors1 = [
    { color: "#D8E9E6", label: "1" },
    { color: "#A4CCC2", label: "25" },
    { color: "#7CB6A8", label: "50" },
    { color: "#3C9E8E", label: "75" },
    { color: "#3C9E8E", label: "100" },
  ];

  const legendColors2 = [
    { color: "rgb(255, 236, 190)", label: "1" },
    { color: "rgb(255, 210, 128)", label: "25" },
    { color: "rgb(211, 168, 90)", label: "50" },
    { color: "rgb(168, 127, 53)", label: "75" },
    { color: "rgb(168, 127, 53)", label: "100" },
  ];

  const legendColors3 = [
    { color: "rgb(252, 202, 206)", label: "1" },
    { color: "rgb(244, 112, 128)", label: "25" },
    { color: "rgb(209, 69, 100)", label: "50" },
    { color: "rgb(156, 44, 74)", label: "75" },
    { color: "rgb(156, 44, 74)", label: "100" },
  ];

  const legendColors4 = [
    { color: "rgb(178, 209, 237)", label: "1" },
    { color: "rgb(114, 168, 219)", label: "25" },
    { color: "rgb(63, 132, 197)", label: "50" },
    { color: "rgb(22, 91, 163)", label: "75" },
    { color: "rgb(22, 91, 163)", label: "100" },
  ];

  const LegendItem = ({ color, label, hide }) => (
    <div className="legend-item">
      {hide === true ? null : <div className="legend-label">{label}</div>}
      <div className="legend-color" style={{ backgroundColor: color }}></div>
    </div>
  );

  const Legend = ({ data, title, unidade, hide }) => {
    return (
      <>
        {!unidade ? null : (
          <p className="font-sans text-[12px] font-medium">{unidade}</p>
        )}
        <div className="flex items-end gap-3">
          {!title ? null : (
            <h2 className="font-sans text-sm -translate-y-1 w-16">{title}</h2>
          )}
          <div className="legend w-[250px] p-0">
            {data.map((item, index) => (
              <LegendItem
                key={index}
                color={item.color}
                label={item.label}
                hide={!hide ? false : true}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  const highlightFeature = (e) => {
    setOnselect(e.target.feature.properties);
    const selectDistrict = argentina.find(
      (district) => district.id === e.target.feature.id
    );
    setMapData(selectDistrict);
  };

  const resetHighlight = (e) => {
    setOnselect({});
    setMapData(null);
  };

  function getStyle(feature) {
    const selectDistrict = argentina.find(
      (district) => district.id === feature.id
    );

    const parties = selectDistrict.parties;
    const sortedParties = parties.sort(
      (a, b) => b.votes.percentage - a.votes.percentage
    );

    console.log(sortedParties);
    if (parties.length > 0 && parties[0].partyID === "134") {
      // Defina as cores com base em party.votes.percentage
      const party = parties[0];
      const percentage = party.votes.percentage;
      let matchedColor = null;
      for (let i = legendColors3.length - 1; i >= 0; i--) {
        const colorData = legendColors3[i];
        if (percentage >= parseInt(colorData.label)) {
          matchedColor = colorData.color;
          break;
        }
      }

      if (matchedColor) {
        return {
          fillColor: matchedColor,
          color: "#fff",
          weight: 0.5,
          fillOpacity: 1,
          opacity: 1,
        };
      } else
        return {
          fillColor: "#ccc",
          color: "#ccc",
          weight: 2,
          fillOpacity: 1,
          opacity: 1,
        };
    }
    if (parties.length > 0 && parties[0].partyID === "135") {
      // Defina as cores com base em party.votes.percentage
      const party = parties[0];
      const percentage = party.votes.percentage;
      let matchedColor = null;
      for (let i = legendColors4.length - 1; i >= 0; i--) {
        const colorData = legendColors4[i];
        if (percentage >= parseInt(colorData.label)) {
          matchedColor = colorData.color;
          break;
        }
      }

      if (matchedColor) {
        return {
          fillColor: matchedColor,
          color: "#fff",
          weight: 0.5,
          fillOpacity: 1,
          opacity: 1,
        };
      } else
        return {
          fillColor: "#ccc",
          color: "#ccc",
          weight: 2,
          fillOpacity: 1,
          opacity: 1,
        };
    } else
      return {
        fillColor: "#ccc",
        color: "#ccc",
        weight: 2,
        fillOpacity: 1,
        opacity: 1,
      };
  }

  function teste(party) {
    if (party.partyID === "134") {
      const percentage = party.votes.percentage;
      let matchedColor = null;
      for (let i = legendColors3.length - 1; i >= 0; i--) {
        const colorData = legendColors3[i];
        if (percentage >= parseInt(colorData.label)) {
          matchedColor = colorData.color;
          break;
        }
      }

      if (matchedColor) {
        return matchedColor;
      } else return "#eee";
    }
    if (party.partyID === "135") {
      // Defina as cores com base em party.votes.percentage

      const percentage = party.votes.percentage;
      let matchedColor = null;
      for (let i = legendColors4.length - 1; i >= 0; i--) {
        const colorData = legendColors4[i];
        if (percentage >= parseInt(colorData.label)) {
          matchedColor = colorData.color;
          break;
        }
      }

      if (matchedColor) {
        return matchedColor;
      }
    } else return "#eee";
  }

  const Modal = ({ data }) => {
    if (!data) return <></>;
    else
      return (
        <div
          className=" opacity-100 bottom-56  bg-[#f7f7f7] z-[9999]
      ] border-slate-200 shadow-2xl px-5 py-4 rounded-md relative m-auto max-w-xs translate-y-[750px]"
        >
          <h2 className="uppercase font-bold text-lg w-[180px] leading-5">
            {data.district}
          </h2>
          {!data.overview.tables.percentage ? null : (
            <p className="mb-4 mt-2 text-sm">
              Urnas apuradas:{" "}
              <b>{data.overview.tables.percentage.toLocaleString()}%</b>
            </p>
          )}
          {data.parties.map((party) => {
            return (
              <>
                <div className="flex justify-between items-center gap-3">
                  <div
                    style={{
                      borderLeft: "16px solid",
                      borderColor: teste(party),
                    }}
                    className="py-2 pl-2"
                  >
                    <p className="font-sans text-lg font-medium leading-4">
                      {party.candidates[0].fullName}
                    </p>
                    <p className="text-sm pt-1 font-light leading-4 text-[#757575] ">
                      {party.partyName}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-2xl  text-[#757575]">
                      {party.votes.percentage.toLocaleString({
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      %
                    </p>
                  </div>
                </div>
                <hr />
              </>
            );
          })}
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

  const maxBounds = [
    [-55, -75],
    [-20, -53],
  ];

  return (
    <MapContainer
      center={[-39.4548214, -64.3254353]}
      //maxBounds={maxBounds}
      zoom={4}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
      style={{
        height: "800px",
        width: "100%",
        zIndex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ZoomControl position="topright" />
      {geojsonData && (
        <>
          <div className="max-w-[250px] absolute">
            <Legend
              data={legendColors3}
              title="Massa"
              unidade=""
              hide={false}
            />
            <Legend data={legendColors4} title="Milei" unidade="" hide={true} />
          </div>
          <Modal data={mapData} />
          <GeoJSON
            data={geojsonData}
            style={getStyle}
            onEachFeature={onEachFeature}
          />
        </>
      )}
    </MapContainer>
  );
};

export default ArgentinaMap;
