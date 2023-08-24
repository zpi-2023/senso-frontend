import createClient from "openapi-fetch";

import { paths } from "./schema";

const BASE_URL = __DEV__
  ? "http://localhost:8088/" // TODO: that will probably need /api/v1/ at the end
  : "WE DO NOT HAVE A PROD DEPLOYMENT :("; // TODO: backend please fix

const { GET } = createClient<paths>({ baseUrl: BASE_URL });

export { GET };
