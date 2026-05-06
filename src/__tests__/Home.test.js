import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../components/Home/Home";

jest.mock("@tsparticles/react", () => () => null);
jest.mock("react-parallax-tilt", () => ({ children }) => <>{children}</>);
jest.mock("typewriter-effect", () => () => <span data-testid="tw">Typewriter</span>);
jest.mock("../Assets/home-main.png", () => "home-main.png");

describe("Home Component", () => {
  const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>);

  test("hero render", () => {
    renderHome();
    expect(screen.getByText(/Merhaba/i)).toBeInTheDocument();
  });

  test("isim gorunur", () => {
    renderHome();
    expect(screen.getByText("ÜMİTCAN ÇİNAR")).toBeInTheDocument();
  });

  test("CTA butonlari var", () => {
    renderHome();
    expect(screen.getByText(/Projelerimi Gör/i)).toBeInTheDocument();
    expect(screen.getByText(/CV İndir/i)).toBeInTheDocument();
  });

  test("scroll indicator var", () => {
    renderHome();
    expect(screen.getByText(/Aşağı Kaydır/i)).toBeInTheDocument();
  });
});
