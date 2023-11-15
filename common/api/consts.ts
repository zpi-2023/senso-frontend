const prodUrl = "https://senso.org.pl/";
export const baseUrl = __DEV__ ? process.env["IP"] ?? prodUrl : prodUrl;
