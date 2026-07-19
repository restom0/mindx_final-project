import {describe, expect, it, vi} from "vitest";
import {SERVER_DOWN_EVENT, SERVER_DOWN_PATH, notifyServerDown} from "./serverDown.js";

describe("serverDown utilities", () => {
  it("exports the server-down route", () => {
    expect(SERVER_DOWN_PATH).toBe("/server-down");
  });

  it("dispatches server-down details in the browser", () => {
    const listener = vi.fn();
    window.addEventListener(SERVER_DOWN_EVENT, listener);

    notifyServerDown({status: 500});

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual({status: 500});
  });

  it("does nothing outside the browser", () => {
    const originalWindow = globalThis.window;

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined
    });

    expect(() => notifyServerDown()).not.toThrow();

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow
    });
  });
});
