import { render, screen } from "@testing-library/react-native";

import { ApiExample } from "./ApiExample";

import { mockApi } from "@/util/api";

describe(ApiExample, () => {
  it("displays data from the API correctly", async () => {
    mockApi("get", "/User", (_req, ctx) => ctx.json(["Andrew"]));

    render(<ApiExample />);

    const text = await screen.findByText("Andrew");
    expect(text).toBeVisible();
  });
});
