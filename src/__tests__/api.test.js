/**
 * API Servis Testleri
 * Hoisting-safe mock: jest.mock factory'i dis scope'a erismez.
 */

jest.mock("axios", () => {
  const instance = {
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    get: jest.fn(), post: jest.fn(), put: jest.fn(),
    delete: jest.fn(), patch: jest.fn(), defaults: { headers: {} },
  };
  // Store reference for test access via require cache trick
  const path = require("path");
  const fs = require("fs");
  return { create: () => instance };
});

// We can't access the mock instance directly due to hoisting.
// Instead, we test via the module's exported functions directly.
import {
  loginUser, logoutUser, getCurrentUser,
  fetchProjects, addProject, deleteProject, updateProject,
  fetchBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
} from "../services/api";

import axios from "axios";

function getApi() {
  return axios.create();
}

describe("API Tests", () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

  describe("Auth", () => {
    test("loginUser stores token", async () => {
      getApi().post.mockResolvedValue({ data: { token: "t1", user: { id: 1, email: "a@b.com" } } });
      const r = await loginUser("a@b.com", "pw");
      expect(localStorage.getItem("authToken")).toBe("t1");
      expect(r.user.email).toBe("a@b.com");
    });

    test("loginUser error", async () => {
      getApi().post.mockRejectedValue(new Error("Bad"));
      await expect(loginUser("x", "y")).rejects.toThrow("Bad");
    });

    test("logoutUser clears token", async () => {
      localStorage.setItem("authToken", "t1");
      getApi().post.mockResolvedValue({ data: {} });
      await logoutUser();
      expect(localStorage.getItem("authToken")).toBeNull();
    });

    test("getCurrentUser no token returns null", async () => {
      expect(await getCurrentUser()).toBeNull();
    });

    test("getCurrentUser with token", async () => {
      localStorage.setItem("authToken", "t1");
      getApi().get.mockResolvedValue({ data: { user: { id: 1 } } });
      expect(await getCurrentUser()).toEqual({ id: 1 });
    });
  });

  describe("Projects", () => {
    test("fetchProjects", async () => {
      getApi().get.mockResolvedValue({ data: [{ id: 1 }] });
      expect(await fetchProjects()).toEqual([{ id: 1 }]);
    });
    test("deleteProject", async () => {
      await deleteProject(10);
      expect(getApi().delete).toHaveBeenCalledWith("/projects/10");
    });
  });

  describe("Blog", () => {
    test("fetchBlogPosts", async () => {
      getApi().get.mockResolvedValue({ data: { posts: [{ id: 5 }] } });
      expect(await fetchBlogPosts()).toEqual([{ id: 5 }]);
    });
    test("deleteBlogPost", async () => {
      await deleteBlogPost(3);
      expect(getApi().delete).toHaveBeenCalledWith("/blog/3");
    });
  });
});
