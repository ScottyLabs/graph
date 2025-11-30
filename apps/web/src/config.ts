import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import env from "@/env";

// OIDC config
// https://github.com/authts/sample-keycloak-react-oidc-context/blob/main/react/src/config.ts
export const userManager = new UserManager({
  authority: env.VITE_AUTHORITY,
  client_id: env.VITE_CLIENT_ID,
  redirect_uri: `${window.location.origin}${window.location.pathname}`,
  post_logout_redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  monitorSession: true, // this allows cross tab login/logout detection
});

export const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};
