import "./App.css";
import React from "react";
import Contact from "./components/contact/Contact";
import Map from "./components/map/Map";
import Handling from "./components/handling/Handling";
import Navbar from "./components/navar/Navbar";
// import Options from "./components/options/Options";
import Teams from "./components/teams/Teams";
import Power from "./components/power/Power";
import Speed from "./components/speed/Speed";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Power />
      <Speed />
      <Map />
      <Handling />

      <Teams />
      <Contact />
    </div>
  );
}
