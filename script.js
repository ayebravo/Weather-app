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

// Get time for forecast

function formatHours(timestamp) {
  let currentDate = new Date(timestamp);
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hour}:${minutes}`;
}

// Using API: when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.

// Change image base on degress

function changeImage(icon) {
  let sunnySrc = "media/sun-cloudy.png";
  let rainySrc = "media/weather-showers-scattered.png";
  let cloudySrc = "media/clouds.png";
  let sunCloudySrc = "media/sun-cloudy.png";
  let stormSrc = "media/storm.png";
  let snowFlakeSrc = "media/cold-weather.png";
  let fogSrc = "media/foggy.png";

  if (icon === "01d" || icon === "01n") {
    return sunnySrc;
  } else if (icon === "04d" || icon === "04n") {
    return cloudySrc;
  } else if (
    icon === "02d" ||
    icon === "02n" ||
    icon === "03d" ||
    icon === "03n"
  ) {
    return sunCloudySrc;
  } else if (
    icon === "09d" ||
    icon === "09n" ||
    icon === "10d" ||
    icon === "10n"
  ) {
    return rainySrc;
  } else if (icon === "11d" || icon === "11n") {
    return stormSrc;
  } else if (icon === "13d" || icon === "13n") {
    return snowFlakeSrc;
  } else if (icon === "50d" || icon === "50n") {
    return fogSrc;
  } else {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}

// Search function (city)

function search(city) {
  let apiKey = `a3f1de950d2940f6c2f8ca0198eb4ea2`;
  let units = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=${units}`;

  let urlWithKey = `${apiUrl}&appid=${apiKey}`;
  axios.get(urlWithKey).then(showTemperature);

  // For forecast

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showForecast);
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

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  // For rows 2-6, use "for loop"
  for (let index = 0; index < 6; index++) {
    // First row was forecast = response.data.list[0];
    // HTML structure copied here is a template that is injected 6 times

    forecast = response.data.list[index];
    let forecastIcon = forecast.weather[0].icon;

    forecastElement.innerHTML += `<div class="row day-1">
              <div class="col-3 col-md-4">
                <h5>${formatHours(forecast.dt * 1000)}</h5>
              </div>
              <div class="col-3 col-md-4 both-temp">
                <p><span class="max-temp forecastItem">${Math.round(
                  forecast.main.temp_max
                )}</span>°</p>
                <p><span class="min-temp forecastItem">${Math.round(
                  forecast.main.temp_min
                )}</span>°</p>
              </div>
              <div class="col-3 col-md-4 image">
                <img src="${changeImage(forecastIcon)}" alt="${
      forecast.weather[0].description
    }" />
              </div>
            </div>`;
  }
}

function showTemperature(response) {
  celsiusTemp = Math.round(response.data.main.temp);

  let tempNumber = document.querySelector("#temp-number");
  tempNumber.innerHTML = `${celsiusTemp}°`;

  colorLinkC();

  isCelsiusLinkClicked = true;

  let cityElement = document.querySelector("#city");
  let cityName = response.data.name;
  cityElement.innerHTML = `${cityName}`;

  // More information card updated with API - Celsius

  let feelsLike = document.querySelector("#feels-like-number");
  tempLike = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `${tempLike}°`;

  let humidityNumber = document.querySelector("#humidity-number");
  let humidity = response.data.main.humidity;
  humidityNumber.innerHTML = `${humidity}%`;

  changeDescription(response);

  showWindSpeed(response);

  let weatherImageElement = document.querySelector("#weather-image");
  weatherImageElement.setAttribute(
    "src",
    changeImage(response.data.weather[0].icon)
  );
  weatherImageElement.setAttribute("alt", response.data.weather[0].description);
  weatherImageElement.style.visibility = "visible";

  let currentDate = new Date(response.data.dt * 1000);
  showDateTime(currentDate);

  changeFavCityIcon(cityName);
}

function changeDescription(response) {
  let descriptionWeatherElement = document.querySelector(
    "#overall-description"
  );
  let description = response.data.weather[0].description;
  descriptionWeatherElement.innerHTML = `${description}`;
}

function showWindSpeed(response) {
  let windSpeedElement = document.querySelector("#speed-number");
  let windSpeed = Math.round(response.data.wind.speed);
  windSpeedElement.innerHTML = `${windSpeed} km/h`;
}

// Celsius colored green

function colorLinkC() {
  let celsiusLink = document.querySelector("#change-to-celsius");
  celsiusLink.classList.add("active");

  let fahrenheitLink = document.querySelector("#change-to-Fahrenheit");
  fahrenheitLink.classList.remove("active");
}

// Change temperature shown when clicking on F's link using API

function clickLinkF(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-number");
  let temperatureCelsius = celsiusTemp;

  let tempFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);

  temperature.innerHTML = `${tempFahrenheit}°`;

  let celsiusLink = document.querySelector("#change-to-celsius");
  celsiusLink.classList.remove("active");

  let fahrenheitLink = document.querySelector("#change-to-Fahrenheit");
  fahrenheitLink.classList.add("active");

  // Feels like updated with API - Fahrenheit

  let feelsLikeC = document.querySelector("#feels-like-number");
  let tempLikeF = tempLike;

  let feelsLikeFahrenheit = Math.round((tempLikeF * 9) / 5 + 32);

  feelsLikeC.innerHTML = `${feelsLikeFahrenheit}°`;

  // For forecast max and min temperatures

  if (isCelsiusLinkClicked === true) {
    let forecastItems = document.querySelectorAll(".forecastItem");
    forecastItems.forEach(function (item) {
      // grabbing the current value to convert
      let currentTemp = item.innerHTML;
      // convert to Fahrenheit
      item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
  }

  isCelsiusLinkClicked = false;
}

let tempFahrenheit = document.querySelector("#change-to-Fahrenheit");
tempFahrenheit.addEventListener("click", clickLinkF);

// Change temperature shown when clicking on C's link using API

function clickLinkC(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-number");

  temperature.innerHTML = `${celsiusTemp}°`;

  let celsiusLink = document.querySelector("#change-to-celsius");
  celsiusLink.classList.add("active");

  let fahrenheitLink = document.querySelector("#change-to-Fahrenheit");
  fahrenheitLink.classList.remove("active");

  // Feels like updated with API - Celsius

  let feelsLikeC = document.querySelector("#feels-like-number");

  feelsLikeC.innerHTML = `${tempLike}°`;

  // For forecast max and min temperatures

  if (isCelsiusLinkClicked === false) {
    let forecastItems = document.querySelectorAll(".forecastItem");
    forecastItems.forEach(function (item) {
      // grabbing the current value to convert
      let currentTemp = item.innerHTML;
      // convert to Fahrenheit
      item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
  }

  isCelsiusLinkClicked = true;
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

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function displayCurrentLocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#button-element");
currentLocationButton.addEventListener("click", displayCurrentLocation);

// Add 3 favorite cities to access their weather more easily

function changeFavCityIcon(cityName) {
  let firstFavCity = getCookie("favorite1");
  let secondFavCity = getCookie("favorite2");
  let thirdFavCity = getCookie("favorite3");

  let iconFavCityEl = document.querySelector("#favorite");

  if (
    cityName === firstFavCity ||
    cityName === secondFavCity ||
    cityName === thirdFavCity
  ) {
    iconFavCityEl.innerHTML = `<i class="fas fa-star"></i>`;
  } else {
    iconFavCityEl.innerHTML = `<i class="far fa-star"></i>`;
  }
}

// Add event listener (click) to star (icon) with id="star-favorite"

function handleStarClick(event) {
  event.preventDefault();

  let cityElement = document.querySelector("#city");
  let cityName = cityElement.innerHTML;

  let firstFavCity = getCookie("favorite1");
  let secondFavCity = getCookie("favorite2");
  let thirdFavCity = getCookie("favorite3");

  let favoriteCity1 = document.querySelector("#favorite-1");
  let favoriteCity2 = document.querySelector("#favorite-2");
  let favoriteCity3 = document.querySelector("#favorite-3");

  // Check if cityName(current city element) is one of the favorites
  if (
    cityName === firstFavCity ||
    cityName === secondFavCity ||
    cityName === thirdFavCity
  ) {
    // Remove city from favorites when I click star
    if (cityName === firstFavCity) {
      favoriteCity1.innerHTML = "Favorite city 1";
      setCookie("favorite1", "", 365);
    } else if (cityName === secondFavCity) {
      favoriteCity2.innerHTML = "Favorite city 2";
      setCookie("favorite2", "", 365);
    } else if (cityName === thirdFavCity) {
      favoriteCity3.innerHTML = "Favorite city 3";
      setCookie("favorite3", "", 365);
    }
  } else {
    // Add city to favorite

    if (firstFavCity === "") {
      favoriteCity1.innerHTML = cityName;

      setCookie("favorite1", cityName, 365);
    } else if (secondFavCity === "") {
      favoriteCity2.innerHTML = cityName;
      setCookie("favorite2", cityName, 365);
    } else if (thirdFavCity === "") {
      favoriteCity3.innerHTML = cityName;
      setCookie("favorite3", cityName, 365);
    } else {
      favoriteCity1.innerHTML = cityName;
      setCookie("favorite1", cityName, 365);
    }
  }

  changeFavCityIcon(cityName);
}

let starElement = document.querySelector("#favorite");
starElement.addEventListener("click", handleStarClick);

function showFavoriteCity(event, cityId) {
  event.preventDefault();
  let favoriteCityEl = document.querySelector(cityId);
  let city = favoriteCityEl.innerHTML;

  search(city);
}

let favoriteCity1 = document.querySelector("#favorite-1");
favoriteCity1.addEventListener("click", function () {
  showFavoriteCity(event, "#favorite-1");
});

let favoriteCity2 = document.querySelector("#favorite-2");
favoriteCity2.addEventListener("click", function () {
  showFavoriteCity(event, "#favorite-2");
});

let favoriteCity3 = document.querySelector("#favorite-3");
favoriteCity3.addEventListener("click", function () {
  showFavoriteCity(event, "#favorite-3");
});

// Get cookie when loading the page

let firstFavCity = getCookie("favorite1");
if (firstFavCity !== "") {
  favoriteCity1.innerHTML = firstFavCity;
}

let secondFavCity = getCookie("favorite2");
if (secondFavCity !== "") {
  favoriteCity2.innerHTML = secondFavCity;
}

let thirdFavCity = getCookie("favorite3");
if (thirdFavCity !== "") {
  favoriteCity3.innerHTML = thirdFavCity;
}

// Global variables that keep track of celsius temperature

let celsiusTemp = 0;
let tempLike = 0;

// It keeps track if C link is clicked - True: C is clicked / False: F is clicked

let isCelsiusLinkClicked = true;

// Show favorite city 1's temperature as default when loading page. If this element doesn't have data saved through cookies, show Paris' temperature by calling search function

search(firstFavCity);
if (firstFavCity === "") {
  search("Paris");
}

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
