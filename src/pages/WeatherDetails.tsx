import axios from "axios";
import { useLoaderData, useParams, type LoaderFunctionArgs } from "react-router";
import type { Location } from "../layouts/MainLayout";
import "./WeatherDetails.css";

export interface CurrentWeather {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
}

export interface WeatherResponse {
    current: CurrentWeather;
}

export async function WeatherLoader({ params } : LoaderFunctionArgs){
    const city  = params.city;
    const cityId = params.cityId;

    if (!city || !cityId) {
        throw new Response("Missing city parameters", { status: 400 });
    }

    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5`);
    const result : Location[] = response.data.results;
    const targetCity = result.find(city => city.id == Number(cityId));

    if (!targetCity) {
        throw new Response("City not found", { status: 404 });
    } 

    const weatherResponse = await axios.get<WeatherResponse>(`https://api.open-meteo.com/v1/forecast?latitude=${targetCity.latitude}&longitude=${targetCity.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
    return weatherResponse.data;
}

function WeatherDetails(){

    const {city} = useParams();
    const weather: WeatherResponse = useLoaderData();
    return(
        <main className="weather-card">
            <div className="weather-card-header">
                <div>
                    <h1>{city}</h1>
                    <p>Current conditions</p>
                </div>
                <p className="weather-temperature">{weather.current.temperature_2m}°</p>
            </div>
            <div className="weather-metrics">
                <div className="weather-metric">
                    <span className="weather-metric-label">Humidity</span>
                    <span className="weather-metric-value">{weather.current.relative_humidity_2m}%</span>
                </div>
                <div className="weather-metric">
                    <span className="weather-metric-label">Wind speed</span>
                    <span className="weather-metric-value">{weather.current.wind_speed_10m} km/h</span>
                </div>
            </div>
        </main>
    )
}

export default WeatherDetails
