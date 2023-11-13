const PROD_URL = "https://senso.org.pl/";
export const BASE_URL = __DEV__ ? process.env["IP"] ?? PROD_URL : PROD_URL;
