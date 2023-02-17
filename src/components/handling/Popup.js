// import { click } from "@testing-library/user-event/dist/click";
import React from "react";
import "./HandlingStyles.css";
import events from "../../data/timeline.json";

function Popup({ closePopup, isPopupVisible, clickedText }) {
  console.log(clickedText);

  const filtertext = events.filter((data, index) => {
    return clickedText === data.title;
  });
  console.log(filtertext);
  return (
    <div className={isPopupVisible ? "popup-box" : "popup-box"}>
      <h3>{filtertext[0].title}</h3>
      {filtertext[0].summary.split("\n").map((paragraph, index) => (
        <p className="popup-text" key={index}>
          {paragraph}
        </p>
      ))}

      <a className="source-link" href={filtertext[0].sources}>
        Click for more info
      </a>
      <button className="popup-button" onClick={closePopup}>
        Close
      </button>
    </div>
  );
}

export default Popup;
