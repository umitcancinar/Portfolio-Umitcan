import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "../components/Projects/Projects";

jest.mock("@tsparticles/react", () => () => null);

const mockData = [{ id: 1, title: "P1", description: "Aciklama 1", imgPath: "", ghLink: "" }];
jest.mock("../services/api", () => ({ fetchProjects: jest.fn() }));
const { fetchProjects } = require("../services/api");

describe("Projects", () => {
  beforeEach(() => jest.clearAllMocks());

  test("baslik render", () => {
    fetchProjects.mockResolvedValue([]);
    render(<MemoryRouter><Projects /></MemoryRouter>);
    expect(screen.getByText(/Son/)).toBeInTheDocument();
  });

  test("projeler listelenir", async () => {
    fetchProjects.mockResolvedValue(mockData);
    render(<MemoryRouter><Projects /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText("P1")).toBeInTheDocument());
  });

  test("bosken mesaj", async () => {
    fetchProjects.mockResolvedValue([]);
    render(<MemoryRouter><Projects /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Henüz proje/i)).toBeInTheDocument());
  });
});
