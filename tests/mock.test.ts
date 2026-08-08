import { describe, expect, it } from "vitest"

describe("2 + 2 = 4", () => {
  it("true", async () => {
    expect(2 + 2).toStrictEqual(4)
  })
})
