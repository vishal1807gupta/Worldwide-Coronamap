
var temp = [];
function updateMap() {
    console.log("Updating Map with Real time data")

    fetch("/data.json")

        .then(response => response.json())
        .then(rsp => {
            console.log(rsp.data);
            rsp.data.forEach(element => {
                latitude = element.latitude
                longitude = element.longitude

                cases = element.infected;

                //Storing Value in temp variable
                temp.push({
                    'type': 'Feature',
                    'properties': {
                        'description':
                            `<strong>${element.name}</strong><p>
                        Infected : ${element.infected}<br>
                        Dead : ${element.dead}<br>
                        Recover : ${element.recovered}<br>
                        Sick : ${element.sick}<br>
                        Country code : ${element.country}<br>
                        Coordinate : ${element.longitude} , ${element.latitude}<br>
                        Update : ${element.lastUpdated}<br>
                        </p>`,
                        'icon': 'theatre'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [longitude, latitude]
                    }
                });

                if (cases >= 2000) {
                    color = "rgb(255, 255, 0)";
                }
                else if (cases >= 1000) {
                    color = "rgb(0, 0, 255)";
                }
                else if (cases >= 255) {
                    color = "rgb(255, 0, 0)";
                }
                else{
                    color =`rgb(${cases},0,0)`
                }
                //Mark on the map
                new mapboxgl.Marker({
                    draggable: false ,
                    color: color
                })
                    .setLngLat([longitude, latitude])
                    .addTo(map);
            });
        })

}
let interval = 2000;
setInterval(updateMap(),interval);

//Hover POPUP

map.on('load', function () {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': temp,
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-allow-overlap': false
        }
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

      
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});