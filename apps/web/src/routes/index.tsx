import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import AuthHello from "@/components/AuthHello";
import Hello from "@/components/Hello";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <div>
        Unauthenticated.{" "}
        <button type="button" onClick={() => auth.signinRedirect()}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <Hello />
      <AuthHello />
      <button type="button" onClick={() => auth.signoutRedirect()}>
        Sign Out
      </button>
    </>
  );
}
