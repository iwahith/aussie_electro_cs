import React, { useEffect, useRef } from "react";

// import mapboxgl from "mapbox-gl"
import mapboxgl from "mapbox-gl";
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import geoJson from "./input_data.json";
import geoJson2 from "./Small_Solar.json";
import "./MapStyles.css";

// mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoiaXdhaGl0aCIsImEiOiJjbGJ3anlsbmkwZWNsM29wcTRqMDZya3h6In0.sgybKNvsRcUJv9R0btx-rQ";
// mapboxgl.accessToken = "pk.eyJ1IjoiaXdhaGl0aCIsImEiOiJjbGJ3azB5MjcwamMzM3hyOXdndWQxNTdjIn0.AmwjFAEb5Gbb3IzM1Lia0g";
// mapboxgl.workerClass = MapboxWorker;

const Map = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/iwahith/clbyt8h2h000h15n2xjctmrsf",
      center: [133.7751, -27.2744],
      zoom: 3.5
    });

    ///////////////////////////////
    map.on("load", () => {
      ///////////////////// MY LAYER - RETIRED DATAPOINT

      map.addSource("places", {
        type: "geojson",
        data: geoJson
      });

      map.addLayer({
        id: "places",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 3.5,
          "circle-color": [
            "match",
            ["get", "Type"],
            "Battery",
            "#800000",
            "Biogas",
            "#469990",
            "Biomass",
            "#dcbeff",
            "Coal",
            "#000000",
            "Distillate",
            "#f58231",
            "Gas",
            "#ffe119",
            "Hyrdo",
            "#42d4f4",
            "Pumps",
            "#f032e6",
            "Solar",
            "#9695A0",
            "Wind",
            "#000075",
            "#4b0082" // any other store type
          ]
          // "circle-stroke-width": 2,
          // "circle-stroke-color": "#ffffff"
        }
      });

      ////////////////////////////////////// Layer 2 - Clustering
      map.addSource("earthquakes", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: geoJson2,
        cluster: true,
        clusterMaxZoom: 6, // Max zoom to cluster points on
        clusterRadius: 60 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });

      // inspect a cluster on click
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"]
        });
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource("earthquakes")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          });
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on("click", "unclustered-point", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const capacity = e.features[0].properties.capacity;
        const year = e.features[0].properties.year;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`Capacity: ${capacity}<br>Year: ${year}`)
          .addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      //////////////////////////////

      /////////////////////////////////// AFTER LAYER
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      map.on("mouseenter", "places", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";
        const properties = e.features[0].properties;
        // const obj = JSON.parse(properties.places);
        const coordinates = e.features[0].geometry.coordinates.slice();

        const content = `<h4>${properties.Station_Code}</h4><p>Energy: ${properties.Fueltech_Label}<p><p>Station ID:${properties.Station_ID}</p>`;

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(content).addTo(map);
      });

      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      // Center the map on the coordinates of any clicked circle from the 'circle' layer.
      map.on("click", "places", (e) => {
        map.flyTo({
          center: e.features[0].geometry.coordinates
        });
      });

      /////////////////// END OF LOAD
    });

    /////////////////////////////////////

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div name="map" className="map">
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
