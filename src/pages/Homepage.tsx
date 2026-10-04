import axios from "axios";
import type { WeatherResponse } from "./WeatherDetails";
import type { Location } from "../layouts/MainLayout";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import "./Homepage.css";

interface RecentSearchesResult {
    name: string;
    id: number;
    temperature: number;
}

function Homepage() {

    const [searchesResponse, setSearchesResponse] = useState<RecentSearchesResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {

        async function getRecentSearchesResult() {
            try {
                const saved = localStorage.getItem("recentSearches");
                const recentSearches: Location[] = saved ? JSON.parse(saved) : [];
                const results = await Promise.all(
                    recentSearches.map(async (search) => {

                        const weatherResponse = await axios.get<WeatherResponse>(
                            `https://api.open-meteo.com/v1/forecast?latitude=${search.latitude}&longitude=${search.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
                        );

                        return {
                            name: search.name,
                            id: search.id,
                            temperature: weatherResponse.data.current.temperature_2m
                        };
                    })
                );

                setSearchesResponse(results);
            } catch {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        }

        getRecentSearchesResult();

    }, []);

    return (
        <main>
            <section className="page-intro">
                <h1 className="page-heading">Weather, wherever you are.</h1>
                <p className="page-subtitle">Search for a city to get the latest local conditions.</p>
            </section>
            <section className="recent-searches-flex-container" aria-label="Recent searches" aria-busy={isLoading}>
                {isLoading && (
                    <div className="recent-searches-loading" aria-label="Loading recent searches">
                        <span />
                        <span />
                        <span />
                    </div>
                )}
                {!isLoading && hasError && (
                    <p className="recent-searches-message">Recent searches could not be loaded.</p>
                )}
                {!isLoading && !hasError && searchesResponse.length === 0 && (
                    <p className="recent-searches-message">Search for a city to see its weather here.</p>
                )}
                {!isLoading && !hasError && searchesResponse.map(response => (
                    <Link
                        key={response.id}
                        to={`/weather/${encodeURIComponent(response.name)}/${response.id}`}
                    >
                        {response.name} | {response.temperature}°C
                    </Link>
                ))}
            </section>
            
        </main>
    );
}

export default Homepage;