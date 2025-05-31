import React, { useState } from "react";
import {
  Search,
  MapPin,
  Droplets,
  Wind,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Palette,
  Moon,
  Eye,
  Square,
} from "lucide-react";

const WeatherApp = () => {
  const apiKey = "6fe3a8f2fb821b1f0c56faf0510fccc7";

  const [weatherData, setWeatherData] = useState({
    humidity: 15,
    windSpeed: 3,
    temperature: 24,
    location: "Agra",
    weatherType: "cloudy",
    description: "Partly Cloudy",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTheme, setCurrentTheme] = useState("dark"); // dark, light, black, eye-protection
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const themes = {
    dark: {
      name: "Dark",
      icon: Moon,
      background: "from-slate-800 via-slate-900 to-black",
      cardBg: "from-slate-700 via-slate-800 to-slate-900",
      text: "text-white",
      subText: "text-slate-300",
      inputBg: "bg-white/10",
      inputBorder: "border-white/20",
      inputPlaceholder: "placeholder-white/60",
      glassEffect: "bg-white/10 backdrop-blur-md border-white/20",
      detailCardBg: "bg-white/5",
    },
    light: {
      name: "Light",
      icon: Sun,
      background: "from-blue-50 via-white to-blue-100",
      cardBg: "from-white via-blue-50 to-blue-100",
      text: "text-gray-800",
      subText: "text-gray-600",
      inputBg: "bg-gray-100/80",
      inputBorder: "border-gray-300/50",
      inputPlaceholder: "placeholder-gray-500",
      glassEffect: "bg-white/60 backdrop-blur-md border-gray-200/50",
      detailCardBg: "bg-white/40",
    },
    black: {
      name: "Black",
      icon: Square,
      background: "from-black via-gray-900 to-black",
      cardBg: "from-gray-900 via-black to-gray-900",
      text: "text-white",
      subText: "text-gray-400",
      inputBg: "bg-gray-800/50",
      inputBorder: "border-gray-700/50",
      inputPlaceholder: "placeholder-gray-400",
      glassEffect: "bg-gray-800/30 backdrop-blur-md border-gray-700/30",
      detailCardBg: "bg-gray-800/20",
    },
    eyeProtection: {
      name: "Eye Care",
      icon: Eye,
      background: "from-amber-50 via-orange-50 to-amber-100",
      cardBg: "from-amber-100 via-orange-100 to-amber-200",
      text: "text-amber-900",
      subText: "text-amber-700",
      inputBg: "bg-amber-100/80",
      inputBorder: "border-amber-300/50",
      inputPlaceholder: "placeholder-amber-600",
      glassEffect: "bg-amber-200/40 backdrop-blur-md border-amber-300/30",
      detailCardBg: "bg-amber-200/30",
    },
  };

  const theme = themes[currentTheme];

  const search = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: Math.floor(data.wind.speed),
          temperature: Math.floor(data.main.temp),
          location: data.name,
          weatherType: getWeatherType(data.weather[0].main.toLowerCase()),
          description: data.weather[0].description,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherType = (weather) => {
    if (weather.includes("clear")) return "clear";
    if (weather.includes("rain")) return "rain";
    if (weather.includes("snow")) return "snow";
    if (weather.includes("cloud")) return "cloudy";
    return "cloudy";
  };

  const getWeatherIcon = (type) => {
    const iconProps = {
      size: 80,
      className:
        currentTheme === "light" || currentTheme === "eyeProtection"
          ? "text-blue-600 drop-shadow-lg"
          : "text-white drop-shadow-lg",
    };

    switch (type) {
      case "clear":
        return (
          <Sun
            {...iconProps}
            className={
              currentTheme === "light" || currentTheme === "eyeProtection"
                ? "text-yellow-500 drop-shadow-lg"
                : "text-yellow-300 drop-shadow-lg"
            }
          />
        );
      case "rain":
        return <CloudRain {...iconProps} />;
      case "snow":
        return <CloudSnow {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const ThemeIcon = theme.icon;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${theme.background} transition-all duration-500`}>
      <div
        className={`w-full max-w-md mx-auto bg-gradient-to-br ${theme.cardBg} rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm relative transition-all duration-500`}>
        {/* Theme Selector */}
        <div className="absolute top-4 right-4 z-10">
          <div className="relative">
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className={`p-3 ${theme.glassEffect} rounded-xl ${theme.text} hover:scale-105 transition-all duration-200 shadow-lg`}>
              <Palette size={20} />
            </button>

            {showThemeSelector && (
              <div
                className={`absolute top-12 right-0 ${theme.glassEffect} rounded-xl p-2 min-w-[160px] shadow-xl`}>
                {Object.entries(themes).map(([key, themeOption]) => {
                  const IconComponent = themeOption.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentTheme(key);
                        setShowThemeSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        key === currentTheme
                          ? `${theme.detailCardBg} ${theme.text}`
                          : `hover:${theme.detailCardBg} ${theme.subText} hover:${theme.text}`
                      }`}>
                      <IconComponent size={16} />
                      <span className="text-sm font-medium">
                        {themeOption.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="p-6 pb-4 pt-16">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a city..."
              className={`w-full px-4 py-3 pr-12 ${theme.text} ${theme.inputBg} backdrop-blur-md border ${theme.inputBorder} rounded-2xl ${theme.inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent text-center font-medium transition-all duration-200`}
            />
            <button
              onClick={search}
              disabled={isLoading}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 ${theme.text} hover:${theme.detailCardBg} rounded-xl transition-all duration-200 disabled:opacity-50`}>
              <Search size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Weather Icon */}
        <div className="flex justify-center py-4">
          <div className={`p-4 ${theme.glassEffect} rounded-full`}>
            {getWeatherIcon(weatherData.weatherType)}
          </div>
        </div>

        {/* Temperature */}
        <div className="text-center px-6">
          <div
            className={`text-6xl font-bold ${theme.text} mb-2 drop-shadow-lg`}>
            {weatherData.temperature}°
          </div>
          <div className={`${theme.subText} text-lg capitalize mb-2`}>
            {weatherData.description}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 px-6 mb-6">
          <MapPin size={24} className={theme.subText} />
          <span className={`text-2xl font-semibold ${theme.text}`}>
            {weatherData.location}
          </span>
        </div>

        {/* Weather Details */}
        <div className="px-6 pb-6">
          <div className={`${theme.glassEffect} rounded-2xl p-4 border`}>
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div
                className={`flex items-center gap-3 p-3 ${theme.detailCardBg} rounded-xl transition-all duration-200`}>
                <div className="p-2 bg-blue-500/30 rounded-lg">
                  <Droplets
                    size={24}
                    className={
                      currentTheme === "light" ||
                      currentTheme === "eyeProtection"
                        ? "text-blue-600"
                        : "text-white"
                    }
                  />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${theme.text}`}>
                    {weatherData.humidity}%
                  </div>
                  <div className={`${theme.subText} text-sm`}>Humidity</div>
                </div>
              </div>

              {/* Wind Speed */}
              <div
                className={`flex items-center gap-3 p-3 ${theme.detailCardBg} rounded-xl transition-all duration-200`}>
                <div className="p-2 bg-green-500/30 rounded-lg">
                  <Wind
                    size={24}
                    className={
                      currentTheme === "light" ||
                      currentTheme === "eyeProtection"
                        ? "text-green-600"
                        : "text-white"
                    }
                  />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${theme.text}`}>
                    {weatherData.windSpeed} m/s
                  </div>
                  <div className={`${theme.subText} text-sm`}>Wind Speed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Indicator */}
        <div className="absolute bottom-4 left-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 ${theme.glassEffect} rounded-full`}>
            <ThemeIcon size={14} className={theme.subText} />
            <span className={`text-xs ${theme.subText} font-medium`}>
              {theme.name}
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
          <div
            className={`absolute -top-4 -right-4 w-24 h-24 ${
              currentTheme === "light" || currentTheme === "eyeProtection"
                ? "bg-blue-200/20"
                : "bg-white/10"
            } rounded-full blur-xl`}></div>
          <div
            className={`absolute -bottom-6 -left-6 w-32 h-32 ${
              currentTheme === "light" || currentTheme === "eyeProtection"
                ? "bg-blue-100/10"
                : "bg-white/5"
            } rounded-full blur-2xl`}></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
