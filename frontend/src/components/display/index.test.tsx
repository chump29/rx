import { render, screen } from "@testing-library/react"
import "vitest-localstorage-mock"

import Display from "."

beforeAll(() => {
  localStorage.setItem("rxName", "testMe")
})

afterAll(() => {
  localStorage.removeItem("rxName")
})

beforeEach(() => {
  render(<Display />)
})

describe("Display", () => {
  it("should display user label", () => {
    expect(
      screen.queryByText("User:") && screen.queryByText("testMe"),
      "User label not found"
    ).toBeInTheDocument()
  })

  it("should display add medication button", () => {
    expect(
      screen.queryByRole("button", { name: "Add Medication" }),
      "Add Medication button not found"
    ).toBeInTheDocument()
  })
})
