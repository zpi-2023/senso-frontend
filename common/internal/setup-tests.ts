import "@testing-library/jest-native/extend-expect";
import { act } from "@testing-library/react-native";
import { mutate } from "swr";

import { mockServer } from "@/common/api/mocks";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- we can't typecheck require() calls
global.fetch = require("node-fetch");

beforeAll(() => {
  mockServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  mockServer.resetHandlers();
  void act(() => {
    void mutate(() => true, undefined, false);
  });
});

afterAll(() => {
  mockServer.close();
});
