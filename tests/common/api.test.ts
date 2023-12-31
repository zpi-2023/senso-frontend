import { renderHook, waitFor } from "@testing-library/react-native";

import { useMutation, useQuery } from "@/common/api";
import { fetcher } from "@/common/api/client";
import { doArgumentsMatch } from "@/common/api/invalidation";
import { mockApi } from "@/common/api/mocks";
import { buildOptions } from "@/common/api/query";
import {
  mockIdentityLoggedIn,
  mockIdentityLoggedOut,
} from "@/common/identity/mocks";

describe("API", () => {
  describe(fetcher, () => {
    it("invokes HTTP GET on the correct endpoint", async () => {
      const handler = jest.fn().mockReturnValue(["John", "Mark"]);
      mockApi("get", "/api/v1/healthz", (ctx) => ctx.json(handler()));

      const data = await fetcher("/api/v1/healthz", {});

      expect(handler).toHaveBeenCalled();
      expect(data).toEqual(["John", "Mark"]);
    });

    it("throws for error code responses", async () => {
      mockApi("get", "/api/v1/healthz", (ctx) => ctx.status(404));

      const promise = fetcher("/api/v1/healthz", {});

      await expect(promise).rejects.toThrow();
    });
  });

  describe(useQuery, () => {
    it("fetches data correctly", async () => {
      mockApi("get", "/api/v1/healthz", (ctx) => ctx.json(["Anne"]));

      const { result } = renderHook(() => useQuery({ url: "/api/v1/healthz" }));

      await waitFor(() => expect(result.current.data).toEqual(["Anne"]));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeFalsy();
    });

    it("returns error when data is unavailable", async () => {
      mockApi("get", "/api/v1/healthz", (ctx) => ctx.status(404));

      const { result } = renderHook(() => useQuery({ url: "/api/v1/healthz" }));

      await waitFor(() => expect(result.current.error).toBeTruthy());
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe(useMutation, () => {
    it("sends correct requests", async () => {
      mockApi("post", "/api/v1/account/token", (ctx) =>
        ctx.json({ token: "123" }),
      );

      const { result } = renderHook(() =>
        useMutation("post", "/api/v1/account/token"),
      );

      const response = await result.current({
        body: { email: "john@paul.pl", password: "12345678" },
      });

      expect(response.data).toEqual({ token: "123" });
    });
  });

  describe(buildOptions, () => {
    it("does not include any headers when the user is logged out", () => {
      const options = buildOptions(
        { url: "/api/v1/healthz" },
        mockIdentityLoggedOut,
      );

      expect(options.headers).toBeUndefined();
    });

    it("includes the Authorization header when the user is logged in", () => {
      const options = buildOptions(
        { url: "/api/v1/healthz" },
        mockIdentityLoggedIn,
      );

      expect(Object.entries(options.headers ?? {})).toContainEqual([
        "Authorization",
        `Bearer ${mockIdentityLoggedIn.token}`,
      ]);
    });
  });

  describe(doArgumentsMatch, () => {
    it("matches exact strings", () => {
      expect(doArgumentsMatch("/api/v1/healthz", "/api/v1/healthz")).toBe(true);
      expect(doArgumentsMatch("/api/v1/notes", "/api/v1/notes")).toBe(true);
    });

    it("matches strings with correct prefix", () => {
      expect(
        doArgumentsMatch(
          "/api/v1/notes/senior/{seniorId}",
          "/api/v1/notes/senior",
        ),
      ).toBe(true);
      expect(doArgumentsMatch("/api/v1/notes/{noteId}", "")).toBe(true);
    });

    it("matches tuples with path as the first element", () => {
      doArgumentsMatch(["/api/v1/notes", {}], "/api/v1/notes");
      doArgumentsMatch(
        ["/api/v1/healthz", { headers: { Authentication: "Bearer TEST" } }],
        "/api/v1",
      );
    });

    it("matches objects with url property", () => {
      doArgumentsMatch({ url: "/api/v1/notes" }, "/api/v1/notes");
      doArgumentsMatch(
        { url: "/api/v1/notes/{noteId}", params: { path: { noteId: "123" } } },
        "/api/v1/notes/{noteId}",
      );
    });
  });
});
