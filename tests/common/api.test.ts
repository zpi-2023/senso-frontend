import { renderHook, waitFor } from "@testing-library/react-native";

import { POST, useApi } from "@/common/api";
import { fetcher } from "@/common/api/client";
import { mockApi } from "@/common/api/mocks";

describe("API", () => {
  describe(POST, () => {
    it("invokes HTTP POST on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(201);
      mockApi("post", "/user", (ctx) => ctx.status(handler()));

      const { response } = await POST("/user", { parseAs: "text" });

      expect(handler).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe(fetcher, () => {
    it("invokes HTTP GET on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(["John", "Mark"]);
      mockApi("get", "/user", (ctx) => ctx.json(handler()));

      const data = await fetcher("/user", {});

      expect(handler).toHaveBeenCalled();
      expect(data).toEqual(["John", "Mark"]);
    });

    it("throws for error code responses", async () => {
      mockApi("get", "/user", (ctx) => ctx.status(404));

      const promise = fetcher("/user", {});

      await expect(promise).rejects.toThrow();
    });
  });

  describe(useApi, () => {
    it("fetches data correctly", async () => {
      mockApi("get", "/user", (ctx) => ctx.json(["Anne"]));

      const { result } = renderHook(() => useApi({ url: "/user" }));

      await waitFor(() => expect(result.current.data).toEqual(["Anne"]));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeFalsy();
    });

    it("returns error when data is unavailable", async () => {
      mockApi("get", "/user", (ctx) => ctx.status(404));

      const { result } = renderHook(() => useApi({ url: "/user" }));

      await waitFor(() => expect(result.current.error).toBeTruthy());
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });
});
