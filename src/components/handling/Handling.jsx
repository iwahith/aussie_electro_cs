import React from "react";
import "./HandlingStyles.css";
import events from "../../data/timeline.json";
import { useState, useEffect } from "react";
import Popup from "./Popup.js";

const Handling = () => {
  const [filteredevent, setFilteredevent] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [clickedText, setClickedText] = useState("");
  const year = [...new Set(events.map((item) => item.decade))];
  const [selectedState, setselctedState] = useState(null);
  const [selectedstation, setselectedstation] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2020);

  const filtereddata = events.filter((data) => {
    return (
      (!selectedState || data.state === selectedState) &&
      (!selectedstation || data.energy_type === selectedstation) &&
      (!selectedYear || data.decade === selectedYear)
    );
  });

  const handleyear = (year) => {
    setSelectedYear(year);
  };
  function handlePopup(event) {
    setClickedText(event.target.innerText);
    console.log(event.target.innerText);
    setIsPopupVisible(!isPopupVisible);
    console.log(isPopupVisible);
  }

  function closePopup() {
    setIsPopupVisible(false);
  }

  const filterstate = (state) => {
    if (selectedState === state) {
      setselctedState(null);
    } else {
      setselctedState(state);
    }

    // setFilteredevent(events.filter((item => item.state === state)))
  };

  const filterstation = (station) => {
    if (selectedstation === station) {
      setselectedstation(null);
    } else {
      setselectedstation(station);
    }
    // setFilteredevent(events.filter((item => item.station === station)))
  };

  const StoryTimeline = () => {
    return (
      <div className="timeline">
        {events &&
          year.map((data, index) => (
            <>
              <button
                className={`button ${selectedYear === data ? "selected" : ""}`}
                key={index}
                value={data}
                onClick={() => handleyear(data)}
              >
                {data}
              </button>
            </>
          ))}
      </div>
    );
  };

  const Statefilter = () => {
    return (
      <div>
        <button
          className="button"
          onClick={() => filterstate("VIC")}
          style={selectedState === "VIC" ? { backgroundColor: "blue" } : {}}
        >
          VIC
        </button>
        <button
          className="button"
          onClick={() => filterstate("QLD")}
          style={selectedState === "QLD" ? { backgroundColor: "blue" } : {}}
        >
          QLD
        </button>
        <button
          className="button"
          onClick={() => filterstate("NSW")}
          style={selectedState === "NSW" ? { backgroundColor: "blue" } : {}}
        >
          NSW
        </button>
        <button
          className="button"
          onClick={() => filterstate("SA")}
          style={selectedState === "SA" ? { backgroundColor: "blue" } : {}}
        >
          SA
        </button>
        <button
          className="button"
          onClick={() => filterstate("WA")}
          style={selectedState === "WA" ? { backgroundColor: "blue" } : {}}
        >
          WA
        </button>
        <button
          className="button"
          onClick={() => filterstate("TAS")}
          style={selectedState === "TAS" ? { backgroundColor: "blue" } : {}}
        >
          TAS
        </button>
      </div>
    );
  };
  const Stationfilter = () => {
    return (
      <div id="station-filter">
        <button
          className="button"
          onClick={() => filterstation("coal")}
          style={selectedstation === "coal" ? { backgroundColor: "blue" } : {}}
        >
          Coal
        </button>
        <button
          className="button"
          onClick={() => filterstation("hydro")}
          style={selectedstation === "hydro" ? { backgroundColor: "blue" } : {}}
        >
          Hydro
        </button>
        <button
          className="button"
          onClick={() => filterstation("small_scale_PV")}
          style={
            selectedstation === "small_scale_PV"
              ? { backgroundColor: "blue" }
              : {}
          }
        >
          Small PV
        </button>
        <button
          className="button"
          onClick={() => filterstation("large_scale_PV")}
          style={
            selectedstation === "large_scale_PV"
              ? { backgroundColor: "blue" }
              : {}
          }
        >
          Large PV
        </button>
        <button
          className="button"
          onClick={() => filterstation("wind")}
          style={selectedstation === "wind" ? { backgroundColor: "blue" } : {}}
        >
          Wind
        </button>
        <button
          className="button"
          onClick={() => filterstation("biomass")}
          style={
            selectedstation === "biomass" ? { backgroundColor: "blue" } : {}
          }
        >
          Biomass
        </button>
      </div>
    );
  };

  return (
    <div name="handling" className="handling">
      <div className="container">
        <div className="top">
          <ul>
            <li>
              <StoryTimeline />
            </li>
            <li>
              <Statefilter />
            </li>
            <li>
              <Stationfilter id="station-filter" />
            </li>
          </ul>
          {/* <h1>StoryPanel</h1> */}
          {filtereddata && (
            <div
              className="heading-container"
              style={{ height: "500px", width: "700px", overflow: "auto" }}
            >
              {filtereddata.map((data, index) => (
                <p className="story-headings">
                  <span onClick={handlePopup}>{data.title}</span>
                </p>
              ))}
            </div>
          )}
          {isPopupVisible && (
            <Popup
              closePopup={closePopup}
              isPopupVisible={isPopupVisible}
              clickedText={clickedText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Handling;
