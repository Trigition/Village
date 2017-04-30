function getData(loc, callback) {
    var xml = new XMLHttpRequest();
    var base_url = 'https://api.openaq.org/v1/measurements?';
    base_url += 'location=' + loc;
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            callback(xml.responseText);
        }
    }
    xml.open('GET', base_url, true);
    xml.send(null);

}

function openAQ_Locations(lat, lng, callback) {
    var xml = new XMLHttpRequest();
    var base_url = 'https://api.openaq.org/v1/locations?';
    base_url += 'coordinates=' + lat + ',' + lng;
    base_url += '&' + 'nearest=' + 5;
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            callback(xml.responseText);
        }
    };
    xml.open('GET', base_url, true);
    xml.send(null);
}

function extractData(responseText) {
    var response = JSON.parse(responseText);
    //console.log(JSON.stringify(response, undefined, 4));
    for (var i=0; i < response.results.length; i++) {
        console.log('City: ' + response.results[i].location);
        console.log('Data: ' + response.results[i].parameter);
        console.log('Time: ' + response.results[i].date.local);
        console.log('\n');
    }
}

function getLocations(responseText) {
    // Convert text into JSON object
    var response = JSON.parse(responseText);
    if (response == null) {
        return null;
    }

    test = document.getElementById('test')

    var results = response.results;
    var mark;
    var pos;
    for (var i=0; i < results.length; i++) {
        pos = {lat : results[i].coordinates.latitude, lng : results[i].coordinates.longitude};
        //mark = new google.maps.Marker( {
        //    position : pos,
        //    map : map
        //});

        getData(results[i].location, extractData);

        mark = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: pos,
            radius : 500
        });
    }
}
