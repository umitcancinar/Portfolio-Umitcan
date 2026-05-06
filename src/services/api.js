import axios from "axios";

/**
 * Backend API service.
 * Replace REACT_APP_API_BASE_URL with your backend server URL.
 * Example: https://your-api-server.com/api
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Authentication ---

/**
 * Log in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  const { token, user } = response.data;
  localStorage.setItem("authToken", token);
  return { token, user };
};

/**
 * Log out the current user.
 */
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("authToken");
  }
};

/**
 * Get the currently authenticated user's data.
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
    const response = await api.get("/auth/me");
    return response.data.user;
  } catch {
    localStorage.removeItem("authToken");
    return null;
  }
};

// --- Projects ---

/**
 * Fetch all projects.
 * @returns {Promise<Array>}
 */
export const fetchProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

/**
 * Add a new project.
 * @param {object} project - { title, description, imgPath, ghLink, demoLink }
 * @returns {Promise<object>}
 */
export const addProject = async (project) => {
  const response = await api.post("/projects", project);
  return response.data;
};

/**
 * Delete a project by ID.
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};

export default api;
