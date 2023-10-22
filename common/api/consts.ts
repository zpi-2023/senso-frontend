export const BASE_URL = __DEV__
  ? process.env["IP"] ?? "http://localhost:8088/"
  : "https://senso.org.pl/";
