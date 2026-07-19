import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";
import QuoteCard from "./QuoteCard.jsx";

const quoteMock = vi.hoisted(() => ({
  quotes: ["First quote", "Second quote"]
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (key === "quotes" && options?.returnObjects) {
        return quoteMock.quotes;
      }

      if (key === "quotes.next") {
        return "Next quote";
      }

      return key;
    }
  })
}));

describe("QuoteCard", () => {
  it("shows quotes deterministically and advances on click", async () => {
    quoteMock.quotes = ["First quote", "Second quote"];
    render(<QuoteCard />);

    expect(screen.getByText("First quote")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", {name: "Next quote"}));

    expect(screen.getByText("Second quote")).toBeInTheDocument();
  });

  it("renders an empty quote when translations are missing", () => {
    quoteMock.quotes = [];
    const {container} = render(<QuoteCard />);

    expect(container.querySelector(".quote-card p")).toHaveTextContent("");
  });
});
