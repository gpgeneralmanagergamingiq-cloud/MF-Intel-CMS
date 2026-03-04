import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";

// v2.3.0 - Removed Demo Mode, cleaned up Dashboard
console.log("Casino CMS v2.3.0 - Demo Mode Removed");

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}