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

export const updateProject = async (id, data) => { const response = await api.put(`/projects/${id}`, data); return response.data; };

// --- Blog ---

export const fetchBlogPosts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.set("category", params.category);
  if (params.tag) queryParams.set("tag", params.tag);
  if (params.search) queryParams.set("search", params.search);
  const queryString = queryParams.toString();
  const url = `/blog${queryString ? `?${queryString}` : ""}`;
  const response = await api.get(url);
  return response.data.posts || response.data;
};

export const fetchBlogPostBySlug = async (slug) => {
  const response = await api.get(`/blog/${slug}`);
  return response.data.post || response.data;
};

export const createBlogPost = async (post) => {
  const response = await api.post("/blog", post);
  return response.data.post || response.data;
};

export const addBlogPost = createBlogPost;

export const updateBlogPost = async (id, data) => {
  const response = await api.put(`/blog/${id}`, data);
  return response.data.post || response.data;
};

export const deleteBlogPost = async (id) => {
  await api.delete(`/blog/${id}`);
};

// --- Contact Messages ---

export const sendContactMessage = async (message) => {
  const response = await api.post("/contact", message);
  return response.data;
};

export const fetchContactMessages = async (params = {}) => {
  const response = await api.get("/contact", { params });
  return response.data.messages;
};

export const markMessageRead = async (id) => {
  const response = await api.patch(`/contact/${id}/read`);
  return response.data;
};

export const deleteContactMessage = async (id) => {
  await api.delete(`/contact/${id}`);
};

// --- Site Settings ---

export const fetchSettings = async () => {
  const response = await api.get("/settings");
  return response.data.settings;
};

export const updateSettings = async (data) => {
  const response = await api.put("/settings", data);
  return response.data;
};

// --- User Management ---

export const fetchUsers = async () => {
  const response = await api.get("/auth/users");
  return response.data.users;
};

export default api;
