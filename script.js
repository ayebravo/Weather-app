// Date and time

function showDateTime(currentDate) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novemeber",
    "December",
  ];

  let month = months[currentDate.getMonth()];

  let date = currentDate.getDate();
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${month} ${date} - ${hour}:${minutes}`;
}

let updatedDateTime = document.querySelector("#date-time");
let newDate = new Date();
updatedDateTime.innerHTML = showDateTime(newDate);

// Using API: when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.

// Temperature Paris, France for when first opening weather app (with API)

let apiKey = `a3f1de950d2940f6c2f8ca0198eb4ea2`;
let units = `metric`;
let city = `Paris`;
let apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=${units}`;

function showTempParis(response) {
  let city = `Paris`;
  let cityName = document.querySelector("#city");
  cityName.innerHTML = `${city}`;

  let tempLandingPage = document.querySelector("#temp-number");
  let tempRounded = Math.round(response.data.main.temp);
  tempLandingPage.innerHTML = `${tempRounded}°`;

  // More information card updated with API - Celsius

  let feelsLike = document.querySelector("#feels-like-number");
  let tempLike = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `${tempLike}°`;

  let humidityNumber = document.querySelector("#humidity-number");
  let humidity = response.data.main.humidity;
  humidityNumber.innerHTML = `${humidity}%`;

  let descriptionWeatherElement = document.querySelector(
    "#overall-description"
  );
  let description = response.data.weather[0].description;
  descriptionWeatherElement.innerHTML = `${description}`;

  changeImage(tempRounded);
}

let urlWithKey = `${apiUrl}&appid=${apiKey}`;
axios.get(urlWithKey).then(showTempParis);

// Change image base on degress

function changeImage(temperature) {
  let weatherImageElement = document.querySelector("#weather-image");

  if (temperature > 20) {
    weatherImageElement.src = "media/sun.png";
  } else {
    weatherImageElement.src = "media/cold-weather.png";
  }
}

// Temperature with API when user searchs for a city with form

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city");
  let city = `${searchInput.value}`;
  let cityName = document.querySelector("#city");
  cityName.innerHTML = `${city}`;

  let apiKey = `a3f1de950d2940f6c2f8ca0198eb4ea2`;
  let units = `metric`;
  let apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=${units}`;

  let urlWithKey = `${apiUrl}&appid=${apiKey}`;
  axios.get(urlWithKey).then(showTemperature);
}

let searchEngineForm = document.querySelector("#search-form");
searchEngineForm.addEventListener("submit", search);

function showTemperature(response) {
  let temperatureCelsius = Math.round(response.data.main.temp);
  let tempNumber = document.querySelector("#temp-number");
  tempNumber.innerHTML = `${temperatureCelsius}°`;

  let cityElement = document.querySelector("#city");
  let cityName = response.data.name;
  cityElement.innerHTML = `${cityName}`;

  // More information card updated with API - Celsius

  let feelsLike = document.querySelector("#feels-like-number");
  let tempLike = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `${tempLike}°`;

  let humidityNumber = document.querySelector("#humidity-number");
  let humidity = response.data.main.humidity;
  humidityNumber.innerHTML = `${humidity}%`;

  let descriptionWeatherElement = document.querySelector(
    "#overall-description"
  );
  let description = response.data.weather[0].description;
  descriptionWeatherElement.innerHTML = `${description}`;

  changeImage(temperatureCelsius);
}

// Change temperature shown when clicking on F's link using API

function clickLinkF(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-number");
  let temperatureCelsius = parseInt(temperature.innerHTML);
  let tempFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);

  temperature.innerHTML = `${tempFahrenheit}°`;

  // Feels like updated with API - Fahrenheit

  let feelsLikeC = document.querySelector("#feels-like-number");
  let tempLikeF = parseInt(feelsLikeC.innerHTML);
  let feelsLikeFahrenheit = Math.round((tempLikeF * 9) / 5 + 32);

  feelsLikeC.innerHTML = `${feelsLikeFahrenheit}°`;
}

let tempFahrenheit = document.querySelector("#change-to-Fahrenheit");
tempFahrenheit.addEventListener("click", clickLinkF);

// Change temperature shown when clicking on C's link using API

function clickLinkC(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-number");
  let temperatureFahrenheit = parseInt(temperature.innerHTML);
  let tempCelsius = Math.round(((temperatureFahrenheit - 32) * 5) / 9);

  temperature.innerHTML = `${tempCelsius}°`;

  // Feels like updated with API - Celsius

  let feelsLikeC = document.querySelector("#feels-like-number");
  let tempLikeC = parseInt(feelsLikeC.innerHTML);
  let tempLikeCelsius = Math.round(((tempLikeC - 32) * 5) / 9);

  feelsLikeC.innerHTML = `${tempLikeCelsius}°`;
}

let tempCelsius = document.querySelector("#change-to-celsius");
tempCelsius.addEventListener("click", clickLinkC);

// When clicking on Current Location button, it uses the Geolocation API to get your GPS coordinates and display and the city and current temperature using the OpenWeather API.

function showPosition(position) {
  let currentLatitude = position.coords.latitude;
  let currentLongitude = position.coords.longitude;

  let apiKey = `a3f1de950d2940f6c2f8ca0198eb4ea2`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=metric`;

  let urlKey = `${apiUrl}&appid=${apiKey}`;
  axios.get(urlKey).then(showTemperature);
}

function displayCurrentLocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#button-element");
currentLocationButton.addEventListener("click", displayCurrentLocation);
