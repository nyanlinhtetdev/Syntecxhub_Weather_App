import { Link } from "react-router";
import "./NotFound.css";

export function NotFound() {
  return (
    <div className="status-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>

      <Link to="/">Go back home</Link>
    </div>
  );
}