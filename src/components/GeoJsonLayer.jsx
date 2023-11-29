import { useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";

const GeoJSONLayer = ({ data }) => {
  console.log(data);
  const map = useMap();

  const zoomToFeature = (e) => {
    const latLngs = [e.target.getLatLng()];
    const markerBounds = L.latLngBounds(latLngs);
    map.fitBounds(markerBounds);
  };

  const markerOptions = { radius: 2, weight: 1, opacity: 1, fillOpacity: 0.8 };

  const markerStyles = function (feature) {
    switch (feature.properties.type) {
      case "Sticker":
        return { color: "#a50026" };
      case "Mural":
        return { color: "#d73027" };
      case "Marker":
        return { color: "#f46d43" };
      case "Characters":
        return { color: "#fdae61" };
      case "Letters":
        return { color: "#fee090" };
      case "Tippex":
        return { color: "#ffffbf" };
      case "Spray":
        return { color: "#e0f3f8" };
      case "Chalk":
        return { color: "#abd9e9" };
      case "Label maker sticker":
        return { color: "#74add1" };
      case "Poster":
        return { color: "#4575b4" };
    }
  };
  // Map Events
  const geoJsonRef = useRef();
  const onMouseOut = (e) => {
    var layer = e.target;
    geoJsonRef.current.setStyle(markerOptions);
  };

  const onMouseOver = (e) => {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
      radius: 3,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  function onEachFeature(feature, layer) {
    if (feature.properties) {
      layer.bindPopup(
        "<div class='popupImage'</div><img src=" +
          "https://d2qr25zh4rluwu.cloudfront.net/" +
          encodeURI(feature.properties.filename) +
          ".jpg " +
          "alt='peng spot photo'" +
          "height='200px'" +
          " " +
          ">" +
          "<div>" +
          "Type: " +
          feature.properties.type +
          "</div><div>" +
          "Description: " +
          feature.properties.desc +
          " </div>"
      );
    }
    layer.on({
      mouseover: onMouseOver,
      mouseout: onMouseOut,
      click: zoomToFeature,
    });
  }

  function pointToLayer(feature, latLng) {
    return L.circleMarker(latLng, markerOptions);
  }

  return (
    <GeoJSON
      data={data}
      pointToLayer={pointToLayer}
      pathOptions={markerStyles}
      onEachFeature={onEachFeature}
      ref={geoJsonRef}
    />
  );
};

export default GeoJSONLayer;
