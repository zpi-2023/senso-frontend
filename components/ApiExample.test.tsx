import { render, screen } from "@testing-library/react-native";

import { ApiExample } from "./ApiExample";

import { mockApi } from "@/util/api/mocks";

describe(ApiExample, () => {
  it("displays data from the API correctly", async () => {
    mockApi("get", "/user", (ctx) => ctx.json(["Andrew"]));

    render(<ApiExample />);

    const text = await screen.findByText("Andrew");
    expect(text).toBeVisible();
  });
});
