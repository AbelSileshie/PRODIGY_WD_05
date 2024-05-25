import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@material-tailwind/react";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  function convertTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${meridiem}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!city) return;

        const url = `${baseUrl}/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await axios.get(url);
        setWeatherData(response.data);

        setError("");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("City not found. Please enter a valid city name.");
        } else {
          setError(
            "An error occurred while fetching weather data. Please try again later."
          );
        }
        setWeatherData(null);
      }
    };

    fetchData();
  }, [city, apiKey]);

  useEffect(() => {
    const currentDate = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    setCurrentDate(currentDate.toLocaleDateString("en-US", options));
  }, []);

  const kelvinToCelsius = (kelvin) => kelvin - 273.15;
  const mpsToMph = (mps) => mps * 2.23694;

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="App min-h-screen flex flex-col items-center py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-5">
        <div className="relative">
          <input
            className="w-full py-2 px-4 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="city"
            placeholder={weatherData ? city : "Enter the city..."}
            value={city}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          <i className="fa-solid fa-magnifying-glass absolute top-2 right-4 text-white"></i>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {weatherData && (
        <div className="container mt-4 bg-[#C4C3C1] bg-opacity-40 rounded-lg shadow-lg p-8 text-white lg:w-[50rem] lg:h-[31rem]">
          <div className="flex flex-col md:flex-row justify-between mb-6 text-white">
            <div className="mb-6 md:mb-0 text-white">
              <h2 className="text-2xl font-bold">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-white">{currentDate}</p>
              <div className="text-center">
                <div className="flex justify-center items-center">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    className="w-16 h-16 mr-4"
                  />
                  <p className="text-4xl font-bold">
                    {kelvinToCelsius(weatherData.main.temp).toFixed(2)} °C
                  </p>
                </div>
              </div>
            </div>
            <div className="text-white">
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  {kelvinToCelsius(weatherData.main.temp).toFixed(2)} °C
                </p>
                <span className="text-sm">Temperature</span>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  {mpsToMph(weatherData.wind.speed).toFixed(2)} mph
                </p>
                <span className="text-sm">Wind Speed</span>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  {convertTime(weatherData.sys.sunrise)}
                </p>
                <span className="text-sm">Sunrise</span>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  {convertTime(weatherData.sys.sunset)}
                </p>
                <span className="text-sm">Sunset</span>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">{weatherData.wind.deg}°</p>
                <span className="text-sm">Wind Direction</span>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  {weatherData.main.humidity}%
                </p>
                <span className="text-sm">Humidity</span>
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  {weatherData.main.pressure} hPa
                </p>
                <span className="text-sm">Pressure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
