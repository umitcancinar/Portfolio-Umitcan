import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import App from "../App";

jest.mock("@tsparticles/react", () => () => null);
jest.mock("react-parallax-tilt", () => ({ children }) => <>{children}</>);
jest.mock("react-pdf", () => ({
  Document: ({ children }) => <div>{children}</div>,
  Page: () => <div />,
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" }, version: "3.11.174" },
}));
jest.mock("typewriter-effect", () => () => <span>TW</span>);
jest.mock("react-github-calendar", () => () => null);

jest.mock("../services/api", () => ({
  loginUser: jest.fn(), logoutUser: jest.fn(), getCurrentUser: jest.fn().mockResolvedValue(null),
  fetchProjects: jest.fn().mockResolvedValue([]), fetchBlogPosts: jest.fn().mockResolvedValue([]),
  sendContactMessage: jest.fn(), fetchContactMessages: jest.fn().mockResolvedValue([]),
  markMessageRead: jest.fn(), deleteContactMessage: jest.fn(),
  fetchSettings: jest.fn().mockResolvedValue({}), updateSettings: jest.fn(),
  fetchUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock("../utils/imageHelper", () => ({ getRawGithubUrl: (url) => url || "" }));
jest.mock("../reportWebVitals", () => jest.fn());
jest.mock("../serviceWorkerRegistration", () => ({ registerServiceWorker: jest.fn() }));
jest.mock("../Assets/home-main.png", () => "hm.png");
jest.mock("../Assets/about.png", () => "ab.png");
jest.mock("../Assets/avatar.png", () => "av.png");

describe("Integration", () => {
  const renderApp = () => render(<HelmetProvider><AuthProvider><App /></AuthProvider></HelmetProvider>);
  beforeEach(() => jest.clearAllMocks());

  test("navbar brand gorunur", async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText("Ümitcan Çinar")).toBeInTheDocument(), { timeout: 5000 });
    await waitFor(() => expect(screen.getByText(/Ana Sayfa/i)).toBeInTheDocument(), { timeout: 5000 });
  });

  test("footer render", async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText(/Tum haklari saklidir/i)).toBeInTheDocument(), { timeout: 5000 });
  });
});
