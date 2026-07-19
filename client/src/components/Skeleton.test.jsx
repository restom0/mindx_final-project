import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import Skeleton from "./Skeleton.jsx";

const factMock = vi.hoisted(() => ({
  facts: ["First fact", "Second fact"]
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (key === "funFacts" && options?.returnObjects) {
        return factMock.facts;
      }

      return key;
    }
  })
}));

describe("Skeleton", () => {
  it("renders the first fun fact and requested placeholder rows", () => {
    factMock.facts = ["First fact", "Second fact"];
    const {container} = render(<Skeleton rows={3} />);

    expect(screen.getByText("First fact")).toBeInTheDocument();
    expect(container.querySelectorAll(".skeleton__row")).toHaveLength(3);
  });

  it("renders an empty fact when translations are missing", () => {
    factMock.facts = [];
    const {container} = render(<Skeleton />);

    expect(container.querySelector(".skeleton__header p")).toHaveTextContent("");
  });
});
