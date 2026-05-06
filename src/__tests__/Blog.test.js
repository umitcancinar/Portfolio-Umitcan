import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "../components/Blog/Blog";

jest.mock("@tsparticles/react", () => () => null);
jest.mock("../Assets/blog1.png", () => "b1.png");
jest.mock("../Assets/blog2.png", () => "b2.png");
jest.mock("../Assets/blog3.png", () => "b3.png");
jest.mock("../Assets/blog4.png", () => "b4.png");
jest.mock("../Assets/blog5.png", () => "b5.png");

describe("Blog", () => {
  test("baslik render", () => {
    render(<MemoryRouter><Blog /></MemoryRouter>);
    expect(screen.getByText(/Teknoloji/)).toBeInTheDocument();
  });

  test("Global Tech News render", () => {
    render(<MemoryRouter><Blog /></MemoryRouter>);
    expect(screen.getByText(/Global Tech News/i)).toBeInTheDocument();
  });

  test("kisisel blog render", () => {
    render(<MemoryRouter><Blog /></MemoryRouter>);
    expect(screen.getByText(/Ümitcan'dan Notlar/i)).toBeInTheDocument();
  });
});
