import { useState } from "react";

export const WeatherApp = () => {
    const urlGeo = 'http://api.openweathermap.org/geo/1.0/direct';
    const urlWeather = 'https://api.openweathermap.org/data/2.5/weather';
    const API_KEY = 'your APIKEY';
    const difKelvin = 273.15

    const [city, setCity] = useState('');
    const [dataWeather, setDataWeather] = useState(null);

    const handleChangeCity = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.length > 0) fetchCoordinates();
    };

    const fetchCoordinates = async () => {
        try {
            const response = await fetch(`${urlGeo}?q=${city}&limit=1&appid=${API_KEY}`);
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0]; 
                fetchWeather(lat, lon); 
            } else {
                console.error("No se encontraron coordenadas para esa ciudad");
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    };

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await fetch(`${urlWeather}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
            const data = await response.json();
            setDataWeather(data); 
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <>
            <div className="container">
                <h1>Weather App</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={city}
                        onChange={handleChangeCity}
                        placeholder="Enter city name"
                    />
                    <button type="submit">Search</button>
                </form>

                {dataWeather && (
                    <div>
                        <h2>Weather in {dataWeather.name}</h2>
                        <p>Temperature: {parseInt(dataWeather?.main?.temp - difKelvin)}°C</p>
                        <p>Weather: {dataWeather.weather[0].description}</p>
                        <p>Humidity: {dataWeather.main.humidity}%</p>
                        <img src={`https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`}  />
                    </div>
                )}
            </div>
        </>
    );
};
