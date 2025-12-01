async function loadData() {
    try {
        const response = await fetch("some-url-here");

        if (!response.ok) {
            console.log("Server returned error status:", response.status);

            return;
        }

        const data = await response.json();
        console.log("Parsed JSON object:", data);

    } catch (err) {
        console.log("Network error or invalid JSON:", err);
    }
}

// Get references to the elements we created in index.html
const queryInput = document.querySelector("#query");
const searchBtn  = document.querySelector("#searchBtn");
const statusEl   = document.querySelector("#status");
const resultsEl  = document.querySelector("#results");
const resultsContainer  = document.querySelector(".card-results");

queryInput.addEventListener("keyup", event => {
    if(event.key !== "Enter")
        return;

    event.preventDefault();

    searchBtn.click();
});

searchBtn.addEventListener("click", () => {
    const query = queryInput.value.trim();

    if (!query) {
        disableResultSection();
        statusEl.textContent = "Please type a city or location";
        resultsEl.innerHTML = "";

        return;
    }

    resultsEl.innerHTML = "";

    fetchLiveData(query);
});

// Helper: build URL
function buildUrl(query) {
    const trimmed = query.trim();
    const apiKey = "50257df1e272468eb04162808250112";

    return "https://api.weatherapi.com/v1/current.json?q="
            + encodeURIComponent(trimmed)
            + "&key="
            + apiKey;
}

// Main AJAX function: send request and parse response
async function fetchLiveData(query) {
    try {
        const url = buildUrl(query);

        if (!url) {
            statusEl.textContent = "Empty URL";

            return;
        }

        // Send HTTP GET request (AJAX) using fetch
        const response = await fetch(url);

        if (!response.ok) {
            statusEl.textContent =
            "The server responded with an error (" + response.status + "). Please try again.";

            disableResultSection();

            return;
        }

    let rawData = await response.json();

    var weatherData = handleApiResponse(rawData);

    renderCards(weatherData);
    } 
    catch (err) {
        disableResultSection();
        console.error(err);
        statusEl.textContent = "Network problem. Check your connection or API key.";
    } 
}

// Handle API response
function handleApiResponse(rawData) {
    let weatherData = {
        title: rawData.location.name,
        temp: "Temperature: " + rawData.current.temp_c + " °C",
        feels: "Feels like: " + rawData.current.feelslike_c + " °C",
        cond: rawData.current.condition.text,
        wind: "Wind: " + rawData.current.wind_kph + " kph",
        hum: "Humidity: " + rawData.current.humidity + "%"
    };

    return weatherData;
}

// Render weather data into the results container
function renderCards(weatherData) {
    resultsContainer.classList.remove("card-disabled");

    var html = 
            '<article class="result-card">' +
            '<h3>' + weatherData.title + '</h3>' +
            '<p>' + weatherData.temp + '</p>' +
            '<p>' + weatherData.feels + '</p>' +
            '<p>' + weatherData.cond + '</p>' +
            '<p class="muted">' + weatherData.wind + '</p>' +
            '<p class="muted">' + weatherData.hum + '</p>' +
            '</article>';

    resultsEl.innerHTML = html;
}

function disableResultSection() {
    resultsContainer.classList.add("card-disabled");
}
