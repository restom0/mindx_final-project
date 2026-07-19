import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import reducer, {
  addHabit,
  awardCompletion,
  checkInHabit,
  recordFocusSession,
  selectProductivity
} from "./productivitySlice.js";

describe("productivitySlice", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-18T10:30:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds a trimmed habit and persists progress", () => {
    const state = reducer(undefined, addHabit({title: "  Read docs  "}));

    expect(state.habits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `habit-${Date.now()}`,
          title: "Read docs",
          cadence: "daily",
          checkIns: []
        })
      ])
    );
    expect(JSON.parse(window.localStorage.getItem("mindx-habits"))).toHaveLength(3);
  });

  it("ignores empty habit titles", () => {
    const state = reducer(undefined, addHabit({title: "   "}));

    expect(state.habits).toHaveLength(2);
  });

  it("checks in a habit once per day and sets a deterministic congratulation", () => {
    const first = reducer(undefined, checkInHabit("habit-focus"));
    const second = reducer(first, checkInHabit("habit-focus"));

    expect(second.habits[0].checkIns).toEqual([{date: "2026-07-18", completed: true}]);
    expect(second.score).toBe(10);
    expect(second.lastCongratulation).toBe("Another small win stacked.");
  });

  it("records focus sessions, levels up, and awards closer badge", () => {
    const state = reducer(
      {...reducer(undefined, {type: "init"}), score: 119},
      recordFocusSession({durationMinutes: 25, completedTask: true, mode: "focus"})
    );

    expect(state.focusSessions[0]).toEqual(
      expect.objectContaining({
        id: `focus-${Date.now()}`,
        durationMinutes: 25,
        completedTask: true,
        mode: "focus"
      })
    );
    expect(state.level).toBe(2);
    expect(state.badges).toEqual(["Level up", "Closer"]);
  });

  it("awards completion points and selects fallback state safely", () => {
    const state = reducer(undefined, awardCompletion());

    expect(state.score).toBe(15);
    expect(state.badges).toEqual(["Task finisher"]);
    expect(selectProductivity({productivity: state})).toEqual(
      expect.objectContaining({
        habits: state.habits,
        focusSessions: [],
        badges: ["Task finisher"],
        level: 1,
        score: 15
      })
    );
    expect(selectProductivity({})).toEqual(
      expect.objectContaining({
        habits: [],
        focusSessions: [],
        badges: [],
        level: 1,
        score: 0,
        lastCongratulation: ""
      })
    );
  });

  it("normalizes persisted productivity data on module load", async () => {
    window.localStorage.setItem(
      "mindx-habits",
      JSON.stringify([
        {
          title: "Stored habit",
          checkIns: [{date: "2026-07-17", completed: 1}, {date: 123}]
        }
      ])
    );
    window.localStorage.setItem(
      "mindx-focus-sessions",
      JSON.stringify([{durationMinutes: "15", completedTask: 1}])
    );
    window.localStorage.setItem("mindx-badges", JSON.stringify(["  Alpha  ", "", 2]));
    window.localStorage.setItem("mindx-level", "3");
    window.localStorage.setItem("mindx-score", "bad");

    vi.resetModules();
    const {default: loadedReducer} = await import("./productivitySlice.js");
    const loadedState = loadedReducer(undefined, {type: "init"});

    expect(loadedState).toEqual(
      expect.objectContaining({
        habits: [
          {
            id: "habit-1",
            title: "Stored habit",
            cadence: "daily",
            checkIns: [{date: "2026-07-17", completed: true}]
          }
        ],
        focusSessions: [
          {
            id: "focus-1",
            todoId: null,
            mode: "focus",
            durationMinutes: 15,
            completedTask: true,
            startedAt: null,
            completedAt: null
          }
        ],
        badges: ["Alpha"],
        level: 3,
        score: 0
      })
    );
  });

  it("falls back when persisted storage cannot be read or parsed", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key) => {
          if (key === "mindx-habits") {
            return "{bad json";
          }

          throw new Error("storage unavailable");
        },
        setItem: () => undefined
      }
    });

    vi.resetModules();
    const {default: loadedReducer} = await import("./productivitySlice.js");
    const loadedState = loadedReducer(undefined, {type: "init"});

    expect(loadedState).toEqual(
      expect.objectContaining({
        habits: [
          {id: "habit-focus", title: "Deep work", checkIns: [], cadence: "daily"},
          {id: "habit-review", title: "Daily review", checkIns: [], cadence: "daily"}
        ],
        level: 1,
        score: 0
      })
    );
  });
});
