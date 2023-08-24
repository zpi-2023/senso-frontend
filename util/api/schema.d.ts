/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/User": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: never;
        };
      };
    };
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["CreateUserDto"];
          "text/json": components["schemas"]["CreateUserDto"];
          "application/*+json": components["schemas"]["CreateUserDto"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: never;
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    CreateUserDto: {
      name: string;
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