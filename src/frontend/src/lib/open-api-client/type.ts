import { paths } from "./open-api";

// --- Utility Types ---

export type Path = keyof paths;
export type Method = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace";

/**
 * Helper to get the operation definition for a given path and method
 */
export type Endpoint<P extends Path, M extends Method> = M extends keyof paths[P] ? paths[P][M] : never;

/**
 * Extract the Request Body JSON type for a given path and method
 */
export type ExtractRequestBody<P extends Path, M extends Method> =
  Endpoint<P, M> extends { requestBody: { content: { "application/json": infer B } } } ? B : never;

/**
 * Extract the Response Body JSON type for a given path, method, and status code (default 200)
 */
export type ExtractResponse<P extends Path, M extends Method, S extends string | number = 200> =
  Endpoint<P, M> extends { responses: { [key in S]: { content: { "application/json": infer C } } } } ? C : never;

/**
 * Extract the 'data' property from the response if it exists, otherwise return the whole response.
 * Useful for APIs that wrap results in a { data: ... } object.
 */
export type ExtractResponseData<P extends Path, M extends Method, S extends string | number = 200> =
  ExtractResponse<P, M, S> extends { data: infer D } ? D : ExtractResponse<P, M, S>;

// --- Type Map ---

/**
 * A map of all endpoints to their Request, Response, and Data types.
 * Usage: AllEndpoints['/path']['method']['data']
 */
export type AllEndpoints = {
  [P in Path]: {
    [M in Method & keyof paths[P]]: {
      request: ExtractRequestBody<P, M>;
      response: ExtractResponse<P, M>;
      data: ExtractResponseData<P, M>;
    }
  }
}

// --- Specific DTO Exports (Examples) ---

export type ListCategoryResponseDto = ExtractResponseData<'/shop/v1/client/category', 'get'>;
export type CategoryResponseDto = ExtractResponseData<'/shop/v1/client/category/{id}', 'get'>;