/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/v1/account": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["CreateAccountDto"];
          "text/json": components["schemas"]["CreateAccountDto"];
          "application/*+json": components["schemas"]["CreateAccountDto"];
        };
      };
      responses: {
        /** @description No Content */
        204: {
          content: never;
        };
        /** @description Bad Request */
        400: {
          content: {
            "text/plain": components["schemas"]["ProblemDetails"];
            "application/json": components["schemas"]["ProblemDetails"];
            "text/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
  "/api/v1/healthz": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["HealthcheckDto"];
            "application/json": components["schemas"]["HealthcheckDto"];
            "text/json": components["schemas"]["HealthcheckDto"];
          };
        };
      };
    };
  };
  "/api/v1/token": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["GetAccountByCredentialsDto"];
          "text/json": components["schemas"]["GetAccountByCredentialsDto"];
          "application/*+json": components["schemas"]["GetAccountByCredentialsDto"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["TokenDto"];
            "application/json": components["schemas"]["TokenDto"];
            "text/json": components["schemas"]["TokenDto"];
          };
        };
        /** @description Unauthorized */
        401: {
          content: {
            "text/plain": components["schemas"]["ProblemDetails"];
            "application/json": components["schemas"]["ProblemDetails"];
            "text/json": components["schemas"]["ProblemDetails"];
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    CreateAccountDto: {
      email?: string;
      password?: string;
      phoneNumber?: string | null;
    };
    GetAccountByCredentialsDto: {
      email?: string;
      password?: string;
    };
    HealthcheckDto: {
      server?: components["schemas"]["HealthcheckStatus"];
      database?: components["schemas"]["HealthcheckStatus"];
    };
    /** @enum {string} */
    HealthcheckStatus: "Ok" | "Unhealthy";
    ProblemDetails: {
      type?: string | null;
      title?: string | null;
      /** Format: int32 */
      status?: number | null;
      detail?: string | null;
      instance?: string | null;
      [key: string]: unknown;
    };
    TokenDto: {
      token?: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
