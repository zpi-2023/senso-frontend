import "@testing-library/jest-native/extend-expect";

import { mockServer } from "./api/mocks";

global.fetch = require("node-fetch");

beforeAll(() => {
  mockServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
