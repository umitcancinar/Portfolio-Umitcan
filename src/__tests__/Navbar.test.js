import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/Navbar";

describe("NavBar Component", () => {
  const renderNavBar = (route = "/") => render(<MemoryRouter initialEntries={[route]}><NavBar /></MemoryRouter>);

  test("tum linkler gorunur", () => {
    renderNavBar();
    ["Ana Sayfa", "Hakkımda", "Projeler", "Özgeçmiş", "Blog", "İletişim"].forEach(t => {
      expect(screen.getByText(t)).toBeInTheDocument();
    });
  });

  test("brand logoyu gosterir", () => {
    renderNavBar();
    expect(screen.getByText("Ümitcan Çinar")).toBeInTheDocument();
  });

  test("github linki var", () => {
    renderNavBar();
    const links = screen.getAllByRole("link");
    const gh = links.filter(l => l.getAttribute("href")?.includes("github.com"));
    expect(gh.length).toBeGreaterThanOrEqual(1);
  });
});
