import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLogin from "../components/Admin/AdminLogin";
import { AuthProvider } from "../context/AuthContext";

jest.mock("@tsparticles/react", () => () => null);
jest.mock("../services/api", () => ({
  loginUser: jest.fn(), logoutUser: jest.fn(), getCurrentUser: jest.fn().mockResolvedValue(null),
  fetchProjects: jest.fn().mockResolvedValue([]), fetchBlogPosts: jest.fn().mockResolvedValue([]),
}));

describe("AdminLogin", () => {
  test("giris formu render", () => {
    render(<MemoryRouter><AuthProvider><AdminLogin /></AuthProvider></MemoryRouter>);
    expect(screen.getByText(/Giriş Yap/i)).toBeInTheDocument();
  });

  test("email ve sifre alanlari mevcut", () => {
    render(<MemoryRouter><AuthProvider><AdminLogin /></AuthProvider></MemoryRouter>);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Şifre")).toBeInTheDocument();
  });
});
