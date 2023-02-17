import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import mapboxgl from "mapbox-gl"
import mapboxgl from "mapbox-gl";
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import geoJson from "./input_data.json";
import "./OptionsStyles.css";

// mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoiaXdhaGl0aCIsImEiOiJjbGJ3anlsbmkwZWNsM29wcTRqMDZya3h6In0.sgybKNvsRcUJv9R0btx-rQ";
// mapboxgl.accessToken = "pk.eyJ1IjoiaXdhaGl0aCIsImEiOiJjbGJ3azB5MjcwamMzM3hyOXdndWQxNTdjIn0.AmwjFAEb5Gbb3IzM1Lia0g";
// mapboxgl.workerClass = MapboxWorker;

const Marker = ({ onClick, children, feature }) => {
  const _onClick = () => {
    onClick(feature.properties.Facility);
  };

  return (
    <button onClick={_onClick} className="marker">
      {children}
    </button>
  );
};

const Options = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/iwahith/clbyt8h2h000h15n2xjctmrsf",
      center: [133.7751, -27.2744],
      zoom: 4
    });

    // Render custom marker components
    geoJson.features.forEach((feature) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement("div");
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker onClick={markerClicked} feature={feature} />,
        ref.current
      );

      // Create a Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  const markerClicked = (title) => {
    window.alert(title);
  };

  return (
    <div name="options" className="options">
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Options;
