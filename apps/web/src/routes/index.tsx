import { createFileRoute } from "@tanstack/react-router";
import { useAuth, useAutoSignin } from "react-oidc-context";
import Hello from "@/components/Hello";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const auth = useAuth();
  const { isLoading, isAuthenticated, error } = useAutoSignin();

  if (isLoading) {
    return <div>Signing you in/out...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        Unauthenticated.
        <button type="button" onClick={() => auth.signinRedirect()}>
          Sign In
        </button>
      </div>
    );
  }

  if (error) {
    return <div>An error occured</div>;
  }

  return <Hello />;
}
