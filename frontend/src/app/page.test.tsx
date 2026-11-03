import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home Page", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should render all elements without throwing", () => {
    const searchParams = Promise.resolve({});
    expect(
      async () => await act(() => render(<Home searchParams={searchParams} />))
    ).not.toThrow();
  });

  it("should render the phone number popup", () => {
    const searchParams = Promise.resolve({});
    act(() => render(<Home searchParams={searchParams} />));
    expect(screen.findByText("Sign up for SMS notifications!")).toBeDefined();
    expect(screen.findByText("Privacy Policy")).toBeDefined();
  });

  it("should render deals", () => {
    const searchParams = Promise.resolve({});
    act(() => render(<Home searchParams={searchParams} />));
    expect(
      screen.findByText("Bottomless mimosas and $5 off entrees")
    ).toBeDefined();
    expect(screen.findByText("Another Special")).toBeDefined();
  });

  it("should render the search bar", () => {
    const searchParams = Promise.resolve({});
    act(() => render(<Home searchParams={searchParams} />));
    expect(screen.findByPlaceholderText("Search deals")).toBeDefined();
  });

  it("should render the submit deal button", () => {
    const searchParams = Promise.resolve({});
    act(() => render(<Home searchParams={searchParams} />));
    expect(screen.findByText("Submit a Deal")).toBeDefined();
  });

  it("should render the logo", () => {
    const searchParams = Promise.resolve({});
    act(() => render(<Home searchParams={searchParams} />));
    expect(screen.findByText("Dibs Deals")).toBeDefined();
  });

  it("should render the login button", () => {
    const searchParams = Promise.resolve({});
    act(() => render(<Home searchParams={searchParams} />));
    expect(screen.findByText("Login")).toBeDefined();
  });
});
