/**
 * API Servis Testleri - Contact, Settings, Users
 * Hoisting-safe mock pattern
 */

jest.mock("axios", () => {
  const inst = {
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    get: jest.fn(), post: jest.fn(), put: jest.fn(),
    delete: jest.fn(), patch: jest.fn(), defaults: { headers: {} },
  };
  return {
    create: () => inst,
    get: inst.get, post: inst.post, put: inst.put,
    delete: inst.delete, patch: inst.patch,
  };
});

import axios from "axios";
import {
  sendContactMessage, fetchContactMessages, markMessageRead,
  fetchSettings, updateSettings, fetchUsers, getCurrentUser,
} from "../services/api";

function api() { return axios.create(); }

describe("API Contact", () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

  test("sendContactMessage", async () => {
    api().post.mockResolvedValue({ data: { ok: true } });
    const r = await sendContactMessage({ name: "Test" });
    expect(r.ok).toBe(true);
  });

  test("fetchContactMessages", async () => {
    api().get.mockResolvedValue({ data: { messages: [{ id: 1 }] } });
    expect(await fetchContactMessages()).toEqual([{ id: 1 }]);
  });

  test("markMessageRead", async () => {
    api().patch.mockResolvedValue({ data: { read: true } });
    expect((await markMessageRead(5)).read).toBe(true);
  });

  test("fetchSettings", async () => {
    api().get.mockResolvedValue({ data: { settings: { siteName: "Test" } } });
    expect(await fetchSettings()).toEqual({ siteName: "Test" });
  });

  test("updateSettings", async () => {
    api().put.mockResolvedValue({ data: { updated: true } });
    expect((await updateSettings({})).updated).toBe(true);
  });

  test("fetchUsers", async () => {
    api().get.mockResolvedValue({ data: { users: [{ id: 1, username: "admin" }] } });
    expect(await fetchUsers()).toEqual([{ id: 1, username: "admin" }]);
  });

  test("auth fails cleans localStorage", async () => {
    localStorage.setItem("authToken", "bad");
    api().get.mockRejectedValue(new Error("Unauthorized"));
    expect(await getCurrentUser()).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
