// This function makes an asynchronous call to DarkSky
var darkSkyKey="c2f84ab8bfd7f56641160d0b0b01659f";

function darkSkyAsyncGET(KEY, lat, long, callback) {
    console.log("Making request to Dark Sky...\n");
    var xml = new XMLHttpRequest();
    var url = 'https://api.darksky.net/forecast/' + KEY + '/';
    url += lat + ',';
    url += long;
    // Request units to be in SI. Convert locally
    url += '?';
    url += 'units=si';
    console.log("HTTP GET: " + url);
    xml.onreadystatechange = function() {
        if (xml.readyState == 4  && xml.status == 200) {
            callback(xml.responseText);
        }
    };
    xml.open('GET', url, true);
    xml.send(null);
}

function getTimeString(timestamp) {
    var time = new Date(timestamp * 1000);
    // Hours are returned in a 24 hour format
    var hours = time.getHours();
    var suffix = ' AM';
    console.log('Hour: ' + hours);
    if (hours > 12) {
        suffix = ' PM';
        hours -= 12;
    } else if (hours == 0) {
        return 'Midnight';
    } else if (hours == 12) {
        return 'Noon';
    }
    return hours + suffix;
}

function getTemperatureString(SI_Temp, unit) {
    var temp = parseFloat(SI_Temp);
    var degreeChar = '\u2103';
    if (unit == 'us') {
        degreeChar = '\u2109';
    }
    return temp.toFixed(2) + degreeChar;
}

function getIcon(icon_string) {
    var iconPath = '<img src="SVG/';
    switch (icon_string) {
        case 'clear-day':
            iconPath += 'Sun.svg"';
            break;
        case 'clear-night':
            iconPath += 'Moon.svg"';
            break;
        case 'rain':
            iconPath += 'Cloud-Rain.svg"';
            break;
        case 'snow':
            iconPath += 'Cloud-Snow-Alt.svg"';
            break;
        case 'sleet':
            iconPath += 'Cloud-Snow.svg"';
            break;
        case 'wind':
            iconPath += 'Wind".svg'
            break;
        case 'fog':
            iconPath += 'Cloud-Fog.svg"';
            break;
        case 'cloudy':
            iconPath += 'Cloud.svg"';
            break;
        case 'partly-cloudy-day':
            iconPath += 'Cloud-Sun.svg"';
            break;
        case 'partly-cloudy-night':
            iconPath += 'Cloud-Moon.svg"';
            break;
    }
    return iconPath + ' class="weather-icon" fill="#BBB">';
}

function getCurrentReport(response) {
    var currentJSON = response.currently;
    // Begin to construct html string to inject
    var infoPanel = document.getElementById('info-panel');
    var heatString = getTemperatureString(currentJSON.temperature, response.flags.units);
    infoPanel.innerHTML = '<h4>Currently:</h4>';
    infoPanel.innerHTML += '<h1>' + currentJSON.summary + '</h1>';
    infoPanel.innerHTML += '<h2>' + heatString + '</h2>';
    // Display Apparent Temperature if it differs from actual
    if (currentJSON.temperature != currentJSON.apparentTemperature) {
        infoPanel.innerHTML += '<h5 class="text-muted">Feels Like:</h5>';
        heatString = getTemperatureString(currentJSON.apparentTemperature, response.flags.units);
        infoPanel.innerHTML += '<h2>' + heatString + '</h2>';
    }
}

function getDailyReport(response) {
    var dailyJSON = response.hourly;
    var dailyConditions = document.getElementById('daily-conditions');
    var dailyTemperatures = document.getElementById('daily-temperature');
    var dailyIcon = document.getElementById('daily-icon');
    //dailyForecast.innerHTML = JSON.stringify(dailyJSON, null, 2);
    // Construct daily forecast from each data object
    var data = dailyJSON.data;
    // Load the next 24 hours into a bootstrap nested row
    for (var i=0; i < 24; i++) {
        dailyConditions.innerHTML += getTimeString(data[i].time) + '<br>';
        dailyTemperatures.innerHTML += getTemperatureString(data[i].temperature, response.flags.units) + '<br>';
        dailyIcon.innerHTML += getIcon(data[i].icon) + '<br>';
    }
}

function loadWeather(responseText) {
    var infoPanel = document.getElementById('info-panel');
    var infoObj = JSON.parse(responseText);
    getCurrentReport(infoObj);
    getDailyReport(infoObj);
}

function weatherButtonClick() {
    var inputField = document.getElementById('location-search').googlePlaces;
    var currentPlace = inputField.getPlace().geometry.location;
    darkSkyAsyncGET(darkSkyKey, currentPlace.lat(), currentPlace.lng(), loadWeather);
}
