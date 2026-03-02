import React from "react";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        Kodlama <strong className="purple">Günlüğüm</strong>
      </h1>

      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcSet="https://raw.githubusercontent.com/umitcancinar/umitcancinar/output/github-contribution-grid-snake-dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcSet="https://raw.githubusercontent.com/umitcancinar/umitcancinar/output/github-contribution-grid-snake.svg"
          />
          <img
            src="https://raw.githubusercontent.com/umitcancinar/umitcancinar/output/github-contribution-grid-snake-dark.svg"
            alt="GitHub Contribution Snake Animation"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </picture>
      </div>
    </Row>
  );
}

export default Github;