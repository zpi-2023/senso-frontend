export const BASE_URL = __DEV__
  ? `http://${process.env["IP"] ?? "localhost"}:8088/` // TODO: that will probably need /api/v1/ at the end
  : "WE DO NOT HAVE A PROD DEPLOYMENT :("; // TODO: backend please fix
