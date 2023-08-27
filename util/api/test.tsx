import {
  renderHook,
  act,
  waitFor,
  render,
  fireEvent,
  screen,
} from "@testing-library/react-native";
import { useState } from "react";
import { Button } from "react-native";

import { AuthProvider, useAuth } from "./auth";
import { get, post } from "./client";
import { mockApi } from "./mocks";
import { useApi } from "./swr";

describe("API", () => {
  describe(useAuth, () => {
    it("initially returns a null token", () => {
      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      expect(result.current.token).toBeNull();
    });

    it("can change the token", () => {
      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      act(() => result.current.setToken("SUPER_SECURE_TOKEN"));

      expect(result.current.token).toBe("SUPER_SECURE_TOKEN");
    });
  });

  describe(post, () => {
    it("invokes HTTP POST on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(201);
      mockApi("post", "/User", (ctx) => ctx.status(handler()));

      const { response } = await post("/User", { parseAs: "text" });

      expect(handler).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe(get, () => {
    it("invokes HTTP GET on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(["John", "Mark"]);
      mockApi("get", "/User", (ctx) => ctx.json(handler()));

      const data = await get("/User", {});

      expect(handler).toHaveBeenCalled();
      expect(data).toEqual(["John", "Mark"]);
    });

    it("throws for error code responses", async () => {
      mockApi("get", "/User", (ctx) => ctx.status(404));

      const promise = get("/User", {});

      await expect(promise).rejects.toThrow();
    });
  });

  describe(useApi, () => {
    it("fetches data correctly", async () => {
      mockApi("get", "/User", (ctx) => ctx.json(["Anne"]));

      const { result } = renderHook(() => useApi({ url: "/User" }));

      await waitFor(() => expect(result.current.data).toEqual(["Anne"]));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeFalsy();
    });

    it("returns error when data is unavailable", async () => {
      mockApi("get", "/User", (ctx) => ctx.status(404));

      const { result } = renderHook(() => useApi({ url: "/User" }));

      await waitFor(() => expect(result.current.error).toBeTruthy());
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("supports conditional queries", async () => {
      const Test = () => {
        const [enabled, setEnabled] = useState(false);
        const { data } = useApi(enabled ? { url: "/User" } : null);
        return (
          <Button onPress={() => setEnabled(true)} title={data ?? "Disabled"} />
        );
      };
      mockApi("get", "/User", (ctx) => ctx.json("Enabled"));

      render(<Test />);
      const disabled = screen.getByText("Disabled");
      expect(disabled).toBeVisible();

      fireEvent.press(disabled);
      const enabled = await screen.findByText("Enabled");
      expect(enabled).toBeVisible();
    });
  });
});
