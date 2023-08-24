import { render, screen } from "@testing-library/react-native";

import { ApiExample } from "./ApiExample";

describe(ApiExample, () => {
  it("displays data from the API correctly", async () => {
    render(<ApiExample />);

    const text = await screen.findByText("Andrew");
    expect(text).toBeVisible();
  });
});
