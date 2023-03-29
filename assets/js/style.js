// sets a variable for result content, search form and search button
var searchFormEl = document.querySelector('#search-form');
var searchButton = document.querySelector('#searchButton')
var resultContent = document.querySelector('#result-content')
// Creates an empty array to store saved searches
var savedSearches = [];
// Creates and sets a variable for the current day
var currentDay = dayjs().format('MM/DD/YYYY')
// Creates a variable for the input of the user
var input = document.getElementById('searchInput')
// Sets search button as an event listener which runs the getAPI function when clicked
searchButton.addEventListener('click', getAPI)
// Sets input as an event listener which runs the function getAPI when the enter key is pressed
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getAPI();
    }
}
);
// Sets the search history list as a variable
var searchHistory = document.getElementById("searchList")
// Runs the functions getHistory and getSavedSearchAPI when page loads
getHistory();
getSavedSearchAPI();
// function displayWeather displays the current weather api for users city
var displayWeather = function (data) {
    var columnEl = document.createElement("div");
    // Gets icon api to display icon image
    var iconSrc = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
    // Styles and positions elements in the current weather box
    columnEl.classList.add("mt-3", "fs-3", "border", "border-secondary", "ps-2")
    // Displays name and date in current weather box
    var currentWeather = document.createElement("div")
    currentWeather.classList.add("fw-bold")
    currentWeather.textContent = data.name + " " + "(" + currentDay + ")"
    // creates tag for icon and displays image
    var iconEl = document.createElement("img")
    iconEl.src = iconSrc
    // creates tag for temp and sets text content
    var tempEl = document.createElement("p")
    tempEl.textContent = "Temp: " + data.main.temp + "\u00B0 F"
    // creates tag for humidity and sets text content
    var humidityEl = document.createElement("P")
    humidityEl.textContent = "Humidty: " + data.main.humidity + "%";
    // creates tag for wind and sets text content
    var windEl = document.createElement("p")
    windEl.textContent = "Wind: " + data.wind.speed + " MPH"

    // Sets each element I created to a column div and sets that to main body
    // this causes each element I created to display
    resultContent.append(columnEl);
    columnEl.append(currentWeather);
    columnEl.append(iconEl)
    columnEl.append(tempEl);
    columnEl.append(humidityEl);
    columnEl.append(windEl)
}
// function that displays the 5 day forecast in 5 cards
function displayForecast(data) {

    var forecastColumn = document.createElement("div")

    var forecastTitle = document.createElement('p')
    forecastTitle.classList.add('fw-bold', "fs-2")
    forecastTitle.textContent = "5 Day Forecast: "

    var cards = document.createElement("div")
    cards.classList.add("row", "gap-5", "row-cols-1", "row-cols-sm-2", "row-cols-md-6", "ps-3")

    for (var i = 0; i < 40; i += 8) {
        var iconSrc = "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
        var icon = document.createElement("img")
        icon.classList.add("w-50")
        icon.src = iconSrc
        var card = document.createElement("div")
        card.classList.add("card")
        var date = document.createElement("h3")
        date.classList.add("pb-2")
        date.textContent = data.list[i].dt_txt.slice(0, 10)
        var temp = document.createElement("p")
        temp.classList.add("pb-2")
        temp.textContent = "Temp : " + data.list[i].main.temp + "\u00B0 F"
        var humidity = document.createElement("P")
        humidity.textContent = "Humidty: " + data.list[i].main.humidity + "%";
        humidity.classList.add("pb-2")
        var wind = document.createElement("p")
        wind.textContent = "Wind: " + data.list[i].wind.speed + " MPH"
        wind.classList.add("pb-2")
         // Sets each element I created to a column div and sets that to main body
        // this causes each element I created to display
        cards.append(card)
        card.append(date)
        card.append(icon)
        card.append(temp)
        card.append(humidity)
        card.append(wind)
    }

    resultContent.append(forecastColumn)
    forecastColumn.append(forecastTitle)
    forecastColumn.append(cards)
}

// function that fetches the weather api based on the users input
function getAPI() {
    var input = document.getElementById('searchInput')
    var userInput = input.value;
    console.log("userInput: " + userInput)
    if (userInput != null && userInput != "") {

        savedSearches.push(userInput);
        localStorage.setItem("searches", JSON.stringify(savedSearches));
        //  Clears input bar and results page
        input.value = "";
        resultContent.innerHTML = "";

        fetch('https://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + userInput + '&APPID=dcf25649f21b3fd9928a7f7117382e65')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayWeather(data);
                getHistory();
            })
        fetch('https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=' + userInput + '&APPID=dcf25649f21b3fd9928a7f7117382e65')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayForecast(data);
            })
    }
}
// function that gets saved searches and displays them in a list as buttons
function getHistory() {
    // clears previous history
    searchHistory.innerHTML = ""
    var getStorage = JSON.parse(localStorage.getItem("searches")) ?? [];
    for (let i = 0; i < getStorage.length; i++) {
        var newLi = document.createElement("button")
        // Sets button id to city that was searched
        newLi.setAttribute("id", getStorage[i])
        newLi.classList.add("bg-secondary", "mt-3", "bg-opacity-50", "ps-2", "fs-4")
        var cityName = getStorage[i];
        cityName = cityName.toUpperCase();
        newLi.textContent = cityName
        searchHistory.append(newLi);
    }
}
// function that allows the saved search buttons to fetch api when clicked
function getSavedSearchAPI() {
    searchHistory.addEventListener("click", (event) => {
        if (event.target.tagName === 'BUTTON') {
            // Targets buttons clicked id
            var userInput = event.target.id;
            // Clears results page
            resultContent.innerHTML = "";

            fetch('https://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + userInput + '&APPID=dcf25649f21b3fd9928a7f7117382e65')
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    displayWeather(data);
                    getHistory();
                })
            fetch('https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=' + userInput + '&APPID=dcf25649f21b3fd9928a7f7117382e65')
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    displayForecast(data);
                })
        }
    })
}