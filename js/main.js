const baseURL = "https://api.weatherapi.com/v1/forecast.json";
const APIKey = "e5037c0a46804d8483a225943240201";
//DOM SELECTION
const tempValueToday = document.querySelector(".temperature-value");
const todayDay = document.querySelector(".head .left");
const todayDate = document.querySelector(".head .right");
const locationDetails = document.querySelector(".content .title");
const todayTemp = document.querySelector(".temperature-value");
const todayIcon = document.querySelector(".temperature-icon");
const todayStatus = document.querySelector(".content .status");
const iconleft = document.querySelector(".icon-left");
const iconmid = document.querySelector(".icon-mid");
const iconright = document.querySelector(".icon-right");
const searchBar = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");
const NextDayTitle = document.querySelectorAll(".card2 .head");
const nextDayContent = document.querySelectorAll(".card2 .content");
let weatherData = {};
let weatherCode = [];
let imgCode;
let imgCodeNextDay;
const weekDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const Month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function getDayName (i=0) {
    let day = new Date();
    if (day.getDay()+i === 7) {
        i = -5;
        return weekDay[day.getDay()+i];
    }
    else return weekDay[day.getDay()+i];
}
function getMonth () {
    let month = new Date();
    return Month[month.getMonth()];
}
function getDate() {
    let date = new Date();
    return date.getDate();
}
async function weatherAPI (city = "alexandria") {
    const response =  await fetch(`${baseURL}?key=${APIKey}&q=${city}&days=3`);
    if(response.status === 200) {
        weatherData = await response.json();
        console.log("Done Weather Main API at status",response.status)
    }
    
}
async function weatherCondition () {
    const response = await fetch ("https://www.weatherapi.com/docs/weather_conditions.json");
    weatherCode = await response.json();
    console.log("Done Weather Condition")
}
function getWeatherIcon () {
    for (let i=0; i<weatherCode.length; i++) {
        if(weatherData.current.condition.code === weatherCode[i].code) {
            console.log("Got Weather Icon!");
            return imgCode=weatherCode[i].icon;
        }
    }
}
function getNextDayWeatherIcon (day) {
    for (let i=0; i<weatherCode.length; i++) {
        if(weatherCode[i].code === weatherData.forecast.forecastday[day].day.condition.code) {
            console.log("Got Weather Icon for next day!");
            return imgCodeNextDay = weatherData.forecast.forecastday[day].day.condition.icon;
        }
    }
}
function getDayOrNight() {
    if(weatherData.current.is_day === 0) {
        return "night";
    }
    else return "day";
}
async function callAPIs() {
    await weatherAPI();
    await weatherCondition();
    showTodayWeather();
    showNextDaysWeather();
}
callAPIs();
function showTodayWeather () {
    todayDay.innerHTML = `<p>${getDayName()}</p>`
    todayDate.innerHTML = `<p>${getDate()} ${getMonth()}</p>`
    tempValueToday.innerHTML = `<p>${weatherData.current.temp_c}&#8451;</p>`
    todayIcon.innerHTML = `<img src="imgs/${getDayOrNight()}/${getWeatherIcon()}.png" alt="" class="w-100">`
    locationDetails.innerHTML = `<p>${weatherData.location.name}</p>`;
    todayStatus.innerHTML = `<p>${weatherData.current.condition.text}</p>`;
    iconleft.innerHTML = `<i class="fa-solid fa-umbrella me-2"></i><span>${weatherData.forecast.forecastday[0].day.daily_will_it_rain}%</span>`;
    iconmid.innerHTML = `<i class="fa-solid fa-wind me-2"></i><span>${weatherData.current.wind_kph} KM / H</span>`;
    iconright.innerHTML = `<i class="fa-solid fa-compass me-2"></i><span>${weatherData.current.wind_dir}</span>`;
}
function showNextDaysWeather () {
    for (let i=0; i<2; i++) {
        NextDayTitle[i].innerHTML = `<p class = "fs-3">${getDayName(i+1)}</p>`;
        nextDayContent[i].innerHTML = `
            <img src="${getNextDayWeatherIcon(i+1)}" alt= "">
            <p class = "fs-2">${weatherData.forecast.forecastday[i+1].day.avgtemp_c}&#8451;</p>
            <p class = "fs-3">${weatherData.forecast.forecastday[i+1].day.mintemp_c}&deg;</p>            
            <p class = "fs-4 text-capitalize">${weatherData.forecast.forecastday[i+1].day.condition.text}</p>            

        `

    }
}
searchBar.addEventListener("keyup", function () {
    weatherAPI(searchBar.value);
    callAPIs();
});
searchBtn.addEventListener("click", function () {
    let value = searchBar.value;
    weatherAPI(value);
    callAPIs();
});