import { useRouteError } from "react-router";
import "./WeatherError.css";

export function WeatherError() {
    const error = useRouteError();

    console.log(error);

    return (
        <div className="status-page">
            <h1>Something went wrong</h1>
            <p>We could not load that weather report.</p>
        </div>
    );
}
