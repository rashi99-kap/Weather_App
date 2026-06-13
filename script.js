let cityName = document.querySelector("#cityName");
let searchBtn = document.querySelector("#searchBtn");

let error = document.querySelector("#error");
let city = document.querySelector("#city");
let temperature = document.querySelector("#temperature");
let weatherCondition = document.querySelector("#weatherCondition");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#windSpeed");
let loading = document.querySelector("#loading");

searchBtn.addEventListener("click", function () {
  let cityInput = cityName.value;



  if (cityInput.trim() === "") {
    error.textContent = "Invalid city name. Please try again.";

    return;
  } else {

    error.textContent = "";
    city.textContent = "";
    temperature.textContent = "";
    weatherCondition.textContent = "";
    humidity.textContent = "";
    windSpeed.textContent = "";

  }



  // Your API key and the base URL

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=10&language=en&format=json`;

  loading.textContent = "Loading...";

  city.textContent = "";
  temperature.textContent = "";
  weatherCondition.textContent = "";
  humidity.textContent = "";
  windSpeed.textContent = "";
  // 4. Call the Geocoding API
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    // 5. Print the JSON response to the console
    .then(data => {
      console.log('Geocoding API Response:', data);

      if (!data.results) {
        error.textContent = "City not found. Please try again.";
        loading.textContent = "";
        return;
      }

      let { name, latitude, longitude, country } = data.results[0];
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`;


      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Convert to JSON
        })
        .then(data => {
          loading.textContent = "";

          // Optional: Log specific values directly

          let temperatureValue = data.current.temperature_2m;

          let weatherCode = data.current.weather_code;
          let conditionText = getWeatherCondition(weatherCode);

          let relativeHumidity = data.current.relative_humidity_2m;

          let wind_speed = data.current.wind_speed_10m;


          document.getElementById("myDiv").style.display = "block";

          city.textContent = `City: ${name}`;
          temperature.textContent = `Temperature: ${temperatureValue} °C`;
          weatherCondition.textContent = `Condition: ${conditionText}`;
          humidity.textContent = `Humidity: ${relativeHumidity} %`;
          windSpeed.textContent = `Wind Speed: ${wind_speed} km/h`;
        })
        .catch(error => {
          loading.textContent = "";
          console.error(error);
          error.textContent = "Something went wrong.";
        });
    })
    .catch(error => {
      loading.textContent = "";
      console.error(error);
      error.textContent = "Something went wrong.";
    });


});

cityName.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {
    searchBtn.click();
  }

});

function getWeatherCondition(code) {
  switch (code) {
    case 0:
      return "Clear Sky ☀️";

    case 1:
    case 2:
      return "Partly Cloudy ⛅";

    case 3:
      return "Cloudy ☁️";

    case 45:
    case 48:
      return "Fog 🌫️";

    case 51:
    case 53:
      return "Light Drizzle 🌦️";

    case 55:
      return "Dense Drizzle 🌧️";

    case 61:
    case 63:
    case 65:
      return "Rain 🌧️";

    case 71:
    case 73:
    case 75:
      return "Snow ❄️";

    case 95:
      return "Thunderstorm ⛈️";

    default:
      return "Unknown Weather";
  }
}



