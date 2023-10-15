import { render, screen, waitFor } from "@testing-library/react-native";

import { Landing } from "@/app/index";
import { mockApi } from "@/common/api/mocks";

describe(Landing, () => {
  it("should show the landing page when the server is working", async () => {
    mockApi("get", "/api/v1/healthz", (ctx) =>
      ctx.json({ server: "Ok", database: "Ok" }),
    );

    render(<Landing />);

    expect(await screen.findByText("Senso")).toBeVisible();
  });

  it("should show an error when the server is down", async () => {
    mockApi("get", "/api/v1/healthz", (ctx) => ctx.status(500));

    render(<Landing />);

    expect(await screen.findByText("Error")).toBeVisible();
  });

  describe("debug info", () => {
    it("should be displayed in development", async () => {
      mockApi("get", "/api/v1/healthz", (ctx) => ctx.status(500));

      render(<Landing debug />);
      await waitFor(() => screen.findByText("Error"));

      expect(screen.getByText(/healthz/)).toBeVisible();
    });

    it("should be hidden in production", async () => {
      mockApi("get", "/api/v1/healthz", (ctx) => ctx.status(500));

      render(<Landing />);
      await waitFor(() => screen.findByText("Error"));

      expect(screen.queryByText(/healthz/)).toBeNull();
    });
  });
});
