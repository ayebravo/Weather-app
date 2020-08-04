// Date and time using API

function showDateTime(currentDate) {
  let updatedDateTime = document.querySelector("#date-time");
  let formattedDate = formatDateTime(currentDate);
  updatedDateTime.innerHTML = `${formattedDate}`;
}

function formatDateTime(currentDate) {
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

// Using API: when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.

// Change image base on degress

function changeImage(response) {
  let weatherImageElement = document.querySelector("#weather-image");
  let sunnySrc = "media/sun-cloudy.png";
  let rainySrc = "media/weather-showers-scattered.png";
  let cloudySrc = "media/clouds.png";
  let sunCloudySrc = "media/sun-cloudy.png";
  let stormSrc = "media/storm.png";
  let snowFlakeSrc = "media/cold-weather.png";
  let fogSrc = "media/foggy.png";

  let alternativeText = response.data.weather[0].description;
  let iconApi = response.data.weather[0].icon;

  if (iconApi === "01d" || iconApi === "01n") {
    weatherImageElement.setAttribute("src", sunnySrc);
  } else if (iconApi === "04d" || iconApi === "04n") {
    weatherImageElement.setAttribute("src", cloudySrc);
  } else if (
    iconApi === "02d" ||
    iconApi === "02n" ||
    iconApi === "03d" ||
    iconApi === "03n"
  ) {
    weatherImageElement.setAttribute("src", sunCloudySrc);
  } else if (
    iconApi === "09d" ||
    iconApi === "09n" ||
    iconApi === "10d" ||
    iconApi === "10n"
  ) {
    weatherImageElement.setAttribute("src", rainySrc);
  } else if (iconApi === "11d" || iconApi === "11n") {
    weatherImageElement.setAttribute("src", stormSrc);
  } else if (iconApi === "13d" || iconApi === "13n") {
    weatherImageElement.setAttribute("src", snowFlakeSrc);
  } else if (iconApi === "50d" || iconApi === "50n") {
    weatherImageElement.setAttribute("src", fogSrc);
  }

  weatherImageElement.style.visibility = "visible";
  weatherImageElement.setAttribute("alt", alternativeText);
}

// Search function (city)

function search(city) {
  let apiKey = `a3f1de950d2940f6c2f8ca0198eb4ea2`;
  let units = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=${units}`;

  let urlWithKey = `${apiUrl}&appid=${apiKey}`;
  axios.get(urlWithKey).then(showTemperature);
}

// Temperature with API when user searchs for a city with form

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city");
  let city = `${searchInput.value}`;

  search(city);
}

let searchEngineForm = document.querySelector("#search-form");
searchEngineForm.addEventListener("submit", handleSubmit);

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

  changeDescription(response);

  changeImage(response);

  let currentDate = new Date(response.data.dt * 1000);
  showDateTime(currentDate);
}

function changeDescription(response) {
  let descriptionWeatherElement = document.querySelector(
    "#overall-description"
  );
  let description = response.data.weather[0].description;
  descriptionWeatherElement.innerHTML = `${description}`;
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

// Add 3 favorite cities to access their weather more easily

// Add event listener (click) to star (icon) with id="star-favorite"

function addFavoriteCity(event) {
  event.preventDefault();

  let cityElement = document.querySelector("#city");
  let cityName = cityElement.innerHTML;

  let favoriteCity1 = document.querySelector("#favorite-1");
  favoriteCity1.innerHTML = cityName;

  setCookie("favorite1", cityName, 365);
}

let starElement = document.querySelector("#star-favorite");
starElement.addEventListener("click", addFavoriteCity);

function handleClick(event) {
  event.preventDefault();
  let favoriteCity1El = document.querySelector("#favorite-1");
  let city = favoriteCity1El.innerHTML;

  search(city);
}

let favoriteCity1 = document.querySelector("#favorite-1");
favoriteCity1.addEventListener("click", handleClick);

// Get cookie when loading the page

var firstFavCity = getCookie("favorite1");
if (firstFavCity != "") {
  favoriteCity1.innerHTML = firstFavCity;
}

// Show Paris temperature as default when loading page by calling search function

search("Paris");

// Cookies section - Generic functions copied from https://www.w3schools.com/js/js_cookies.asp

//setCookies: It saves user's data in user's computer
//cname: name of cookie (string)
//cvalue: value you want to save
//exdays: number of days the cookie is stored before it expires
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//getCookie: retrives data from user's browser
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
