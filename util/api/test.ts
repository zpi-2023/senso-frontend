import { renderHook, act, waitFor } from "@testing-library/react-native";

import { AuthProvider, useAuth } from "./auth";
import { fetcher, POST } from "./client";
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

  describe(POST, () => {
    it("invokes HTTP POST on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(201);
      mockApi("post", "/User", (ctx) => ctx.status(handler()));

      const { response } = await POST("/User", { parseAs: "text" });

      expect(handler).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe(fetcher, () => {
    it("invokes HTTP GET on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(["John", "Mark"]);
      mockApi("get", "/User", (ctx) => ctx.json(handler()));

      const data = await fetcher("/User", {});

      expect(handler).toHaveBeenCalled();
      expect(data).toEqual(["John", "Mark"]);
    });

    it("throws for error code responses", async () => {
      mockApi("get", "/User", (ctx) => ctx.status(404));

      const promise = fetcher("/User", {});

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
  });
});
