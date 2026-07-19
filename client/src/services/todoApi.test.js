import {beforeEach, describe, expect, it, vi} from "vitest";
import {SERVER_DOWN_EVENT} from "../utils/serverDown.js";
import {todoApi} from "./todoApi.js";

describe("todoApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("sends localized list queries", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({data: []}), {status: 200}));

    await expect(todoApi.list({search: "docs"}, "fr")).resolves.toEqual({data: []});

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/todos?search=docs",
      expect.objectContaining({
        headers: expect.objectContaining({"Accept-Language": "fr"})
      })
    );
  });

  it("serializes create payloads", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({data: {id: "1"}}), {status: 201}));

    await todoApi.create({title: "Ship"}, "en");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/todos",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({title: "Ship"})
      })
    );
  });

  it("serializes update, focus, habit, demo, and AI API calls", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({data: {ok: true}}), {status: 200}));

    await todoApi.update("task/1", {completed: true}, "en");
    await todoApi.createFocusSession({durationMinutes: 25}, "en");
    await todoApi.listHabits("en");
    await todoApi.createHabit({title: "Move"}, "en");
    await todoApi.checkInHabit("habit/1", {completed: true}, "en");
    await todoApi.seedDemoData({reset: true}, "en");
    await todoApi.aiBreakdown({title: "Launch"}, "en");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/todos/task%2F1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({completed: true})
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/todos/focus-sessions",
      expect.objectContaining({method: "POST"})
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "/api/habits",
      expect.objectContaining({
        headers: expect.objectContaining({"Accept-Language": "en"})
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "/api/habits",
      expect.objectContaining({method: "POST"})
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      5,
      "/api/habits/habit%2F1/check-ins",
      expect.objectContaining({method: "POST"})
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      6,
      "/api/demo/seed",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({reset: true})
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      7,
      "/api/ai/task-breakdown",
      expect.objectContaining({method: "POST"})
    );
  });

  it("throws a fallback message for non-json client errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", {status: 400}));

    await expect(todoApi.create(null, "")).rejects.toThrow("Request failed");
  });

  it("notifies the app when a server response fails with 5xx", async () => {
    const listener = vi.fn();
    window.addEventListener(SERVER_DOWN_EVENT, listener);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({message: "Server unavailable"}), {status: 500})
    );

    await expect(todoApi.remove("task-1", "en")).rejects.toThrow("Server unavailable");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual({
      status: 500,
      message: "Server unavailable"
    });
  });

  it("notifies the app on network errors", async () => {
    const listener = vi.fn();
    window.addEventListener(SERVER_DOWN_EVENT, listener);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(todoApi.list({}, "en")).rejects.toThrow("Failed to fetch");

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not dispatch another server-down event when already on the server-down page", async () => {
    const listener = vi.fn();
    window.history.pushState({}, "", "/server-down");
    window.addEventListener(SERVER_DOWN_EVENT, listener);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", {status: 503}));

    await expect(todoApi.list({}, "en")).rejects.toThrow("Request failed");

    expect(listener).not.toHaveBeenCalled();
  });
});
