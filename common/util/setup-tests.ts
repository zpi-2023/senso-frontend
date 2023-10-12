import "@testing-library/jest-native/extend-expect";
import { act } from "@testing-library/react-native";
import { mutate } from "swr";

import { mockServer } from "@/common/api/mocks";

global.fetch = require("node-fetch");

beforeAll(() => {
  mockServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  mockServer.resetHandlers();
  act(() => {
    mutate(() => true, undefined, false);
  });
});

afterAll(() => {
  mockServer.close();
});
