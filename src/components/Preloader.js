import React from "react";

function Preloader(props) {
  return (
    <div id={props.load ? "preloader" : "preloader-none"}>
      <div className="preloader-content">
        <div className="loader-text">
            {/* Kodlama işaretleri ve İsmin */}
            <span className="bracket">&lt;</span>
            <span className="initials"> ÜMİTCAN ÇINAR </span>
            <span className="bracket">/&gt;</span>
        </div>
        <div className="loader-line"></div>
      </div>
    </div>
  );
}

export default Preloader;