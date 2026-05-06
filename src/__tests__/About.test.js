import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "../components/About/About";

jest.mock("@tsparticles/react", () => () => null);
jest.mock("react-parallax-tilt", () => ({ children }) => <>{children}</>);
jest.mock("react-github-calendar", () => () => <div data-testid="gh-cal" />);
jest.mock("../services/api", () => ({ fetchProjects: jest.fn().mockResolvedValue([]) }));
jest.mock("../hooks/useScrollReveal", () => () => [null, true]);
jest.mock("../components/About/Github", () => () => <div data-testid="gh-section">GH</div>);
jest.mock("../components/About/Techstack", () => () => <div data-testid="tech">Tech</div>);
jest.mock("../components/About/Toolstack", () => () => <div data-testid="tool">Tool</div>);
jest.mock("../components/About/AboutCard", () => () => <div data-testid="card">Card</div>);
jest.mock("../components/About/Timeline", () => () => <div data-testid="timeline">Timeline</div>);
jest.mock("../Assets/about.png", () => "about.png");

describe("About", () => {
  test("baslik render", () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByText(/KİM OLDUĞUMU/)).toBeInTheDocument();
  });

  test("alt bilesenler render", () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("tech")).toBeInTheDocument();
    expect(screen.getByTestId("tool")).toBeInTheDocument();
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });
});
