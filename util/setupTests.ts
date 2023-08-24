import "@testing-library/jest-native/extend-expect";

import { server } from "./api/mocks";

global.fetch = require("node-fetch");

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
