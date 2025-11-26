// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import type * as express from "express";

export const BEARER_AUTH = "bearerAuth";
export const MEMBER_SCOPE = "org:member";
export const ADMIN_SCOPE = "org:admin";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  return new Promise((resolve, reject) => {
    const response = request.res;
    if (securityName !== BEARER_AUTH) {
      response?.status(401).json({ message: "Invalid security name" });
      return reject({});
    }

    return verifyToken(request, response, reject, resolve, scopes);
  });
}

const verifyToken = async (
  _request: express.Request,
  _response: express.Response | undefined,
  _reject: (value: unknown) => void,
  resolve: (value: unknown) => void,
  _scopes?: string[],
) => {
  return resolve({});
};
