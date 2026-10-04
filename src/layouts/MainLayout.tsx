import axios from "axios";
import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router"
import './MainLayout.css'

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  admin3_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
  admin3: string;
}

function MainLayout(){
    const [searchText, setSearchText] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [cities, setCities] = useState<Location[]>([]);
    const navigate = useNavigate();

    async function fetchCitiesData(text: string) {
        try {
            const response = await axios.get(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(text)}&count=5`
            );

            setCities(response.data.results ?? []);
        }
        catch (error) {
            console.log(error);
            setCities([]);
        }
    }

    async function searchOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const text = e.target.value;

        setSearchText(text);
        setShowDropdown(true);

        if (text.trim() === "") {
            setCities([]);
            return;
        }

        await fetchCitiesData(text);
    }

    function handleSuggestionClick(city : Location){

        const recentSearches = localStorage.getItem('recentSearches')
        let recentSearchesArray: Location[] = [];
        if(recentSearches){
            recentSearchesArray = JSON.parse(recentSearches);
        }

        const updatedSearches = [
            city,
            ...recentSearchesArray.filter((search) => search.id != city.id),
        ].slice(0, 3);

        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))

        navigate(`/weather/${encodeURIComponent(city.name)}/${city.id}`)
        setSearchText("");
        setShowDropdown(false);
    }

    return(
        <div className="weather-app">
            <nav className="navbar">
                <Link to="/">WeatherApp</Link>
                <div className="search-input">
                    <input type="text"
                        value={searchText} 
                        onChange={(e) => {
                            searchOnChange(e)
                        }}
                        placeholder="Search" 
                    />

                    {showDropdown && searchText && (
                        <div className="search-results">
                        {cities.map((city) => (
                            <div
                            key={city.id}
                            onClick={() => handleSuggestionClick(city)}                            
                            >
                            {city.name}, {city.country}
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </nav>

            <Outlet />
        </div>
    )
}

export default MainLayout