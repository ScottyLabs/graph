// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import type * as express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import env from "../env";

export const BEARER_AUTH = "bearerAuth";
export const ADMIN_SCOPE = "graph-admins";

const client = jwksClient({ jwksUri: env.AUTH_JWKS_URI });

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

    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      response?.status(401).json({ message: "No token provided" });
      return reject({});
    }

    return verifyToken(token, response, reject, resolve, scopes);
  });
}

const verifyToken = async (
  token: string,
  response: express.Response | undefined,
  reject: (value: unknown) => void,
  resolve: (value: unknown) => void,
  scopes?: string[],
) => {
  jwt.verify(
    token,
    (header, callback) => {
      client.getSigningKey(header.kid, (_error, key) => {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
      });
    },
    { issuer: env.AUTH_ISSUER },
    (error, decoded) => {
      // Check if the token is valid
      if (error) {
        console.error("Authentication error:", error.message);
        response?.status(401).json({ message: "Invalid token" });
        return reject({});
      }

      // Check if the token format is valid
      if (!decoded || typeof decoded !== "object") {
        response?.status(401).json({ message: "Invalid token format" });
        return reject({});
      }

      // Check if the token contains the required scopes
      for (const scope of scopes ?? []) {
        if (!decoded["groups"]?.includes(scope)) {
          response
            ?.status(401)
            .json({ message: "JWT does not contain required scope." });
          return reject({});
        }
      }

      return resolve({ token });
    },
  );
};
