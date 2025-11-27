import { User } from "oidc-client-ts";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import env from "@/env";
import type { paths } from "../../../server/build/swagger.d.ts";

// https://www.npmjs.com/package/react-oidc-context section "Call a protected API"
function getUser() {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${env.VITE_AUTHORITY}:${env.VITE_CLIENT_ID}`,
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

const fetchClient = createFetchClient<paths>({
  baseUrl: `${env.VITE_SERVER_URL}`,
  fetch: async (input: Request) => {
    const user = getUser();
    const token = user?.access_token;
    if (token) {
      input.headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(input);
  },
});

const $api = createClient(fetchClient);

export default $api;
