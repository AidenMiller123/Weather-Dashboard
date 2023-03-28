var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var searchButton = document.querySelector('#searchButton')
var resultContent = document.querySelector('#result-content')
var savedSearches = [];

var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=London,uk&APPID=dcf25649f21b3fd9928a7f7117382e65';
var currentDay = dayjs().format('MM/DD/YYYY')


var input = document.getElementById('searchInput')
    searchButton.addEventListener('click', getAPI)
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            getAPI();
        }
    }        
    );

var searchHistory = document.getElementById("searchList")
getHistory();

var displayWeather = function (data) {
    var columnEl = document.createElement("div");
    var iconSrc = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"

    columnEl.classList.add("mt-3", "fs-3", "border", "border-secondary", "ps-2")


    var currentWeather = document.createElement("div")
    currentWeather.classList.add("fw-bold")
    currentWeather.textContent = data.name + " " + "(" + currentDay + ")"

    var iconEl = document.createElement("img")
    iconEl.src = iconSrc


    var tempEl = document.createElement("p")
    tempEl.textContent = "Temp: " + data.main.temp + "\u00B0 F"


    var humidityEl = document.createElement("P")
    humidityEl.textContent = "Humidty: " + data.main.humidity + "%";

    var windEl = document.createElement("p")
    windEl.textContent = "Wind: " + data.wind.speed + " MPH"

    resultContent.append(columnEl);
    columnEl.append(currentWeather);
    columnEl.append(iconEl)
    columnEl.append(tempEl);
    columnEl.append(humidityEl);
    columnEl.append(windEl)
}

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


function getAPI() {
    var input = document.getElementById('searchInput')
    var userInput = input.value;
    console.log("userInput: " + userInput)
    if (userInput != null && userInput != "") {
        savedSearches.push(userInput);
        localStorage.setItem("searches", JSON.stringify(savedSearches));

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




function getHistory() {
    searchHistory.innerHTML = ""
    var getStorage = JSON.parse(localStorage.getItem("searches")) ?? [];
    for (let i = 0; i < getStorage.length; i++) {
        var newLi = document.createElement("button")
        newLi.setAttribute("id", "searches")  //Change 'searches' to 'getStorage[i]'
        newLi.classList.add("bg-secondary", "mt-3", "bg-opacity-50", "ps-2", "fs-3")
        newLi.textContent = getStorage[i];
   //     newLi.addEventListener = ('click', getSavedSearchAPI(getStorage[i]));
        searchHistory.append(newLi);

    }
    // if (getStorage.length > 0){
    //     var savedSearchButton = document.getElementById("searches")
    //     savedSearchButton.addEventListener('click', getSavedSearchAPI(getStorage[i]))
    // }
}

function getSavedSearchAPI(cityName){

    var userInput = cityName;
    console.log("userInput: " + userInput)
    
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