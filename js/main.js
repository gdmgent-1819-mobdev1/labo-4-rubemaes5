mapboxgl.accessToken = 'pk.eyJ1IjoiYnJlYWtpbmcyNjIiLCJhIjoiY2puOWF4d2huMDRtMTNycDg5eTBkaWw2aSJ9.L5hwBhfK_8aFPp6nTCruwQ';
let map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-74.50, 40], // starting position
    zoom: 9 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control to the map.

map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

//localStorage.clear();
function logToConsole(people) {
    console.log(people); // works fine
    console.log(people[0]); // returns undefined
    console.log(people.length); //returns 0
};
let people = [];
let likes = [];
let dislikes = [];
let ll;
let i = 0;

document.addEventListener("dragstart", dragStart, false);
document.addEventListener("drop", drop, false);
document.addEventListener("dragend", dragEnd, false);
document.addEventListener("dragover", dragOver, false);

function dragStart(e){
    console.log("udrag")
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", e.target.className);
}
function drop(e){
    e.preventDefault();
    console.log(e.toElement.className)
    if(e.toElement.className === "likedropzone"){
        console.log("ulike "+e.toElement.className);
        like();
    }else if(e.toElement.className === "dislikedropzone"){
        console.log("udislike "+e.toElement.className);
        dislike();
    }
}
function dragEnd(e){
    e.preventDefault();
   
}
function dragOver(e){
    e.preventDefault();
    
}


if (localStorage.getItem("likes") !== null) {
    likes = JSON.parse(localStorage.getItem("likes"));
}
if (localStorage.getItem("dislikes") !== null) {
    dislikes = JSON.parse(localStorage.getItem("dislikes"));
}
if (localStorage.getItem("people") === null) {
    fetch('https://randomuser.me/api/?results=10')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < 10; i++) {
                let person = data.results[i];
                if (dislikes.includes(person.login.uuid) || likes.includes(person.login.uuid)) {
                    continue;
                } else {
                    let x = {
                        name: person.name.first + " " + person.name.last,
                        picture: person.picture.large,
                        age: person.dob.age,
                        place: person.location.street + "<br>" + person.location.city,
                        id: person.login.uuid,
                        lat: person.location.coordinates.latitude,
                        long: person.location.coordinates.longitude
                    }
                    people.push(x);
                }
            }
            lengte = people.length;
            logToConsole(people);
            showPeople();
            judge();
        }).catch(function (error) {
            console.log('Data is not shown ' + error.message);
        });
} else {
    people = JSON.parse(localStorage.getItem("people"));
    showPeople();
    console.log(people)
    judge();
}

function judge() {
    localStorage.setItem("people", JSON.stringify(people));
    document.getElementById("heartclick").addEventListener("click", like)
    document.getElementById("skipclick").addEventListener("click", dislike)
}

document.getElementById("clickforlikes").addEventListener('click', function () {
    document.getElementById("yourdislikes").innerHTML = "";
    document.getElementById("yourlikes").innerHTML = "";
    document.querySelectorAll('.yourlikes')[0].style.left = "0";
    for (x = 0; x < dislikes.length; x++) {
        if (dislikes.length > 0) {
            let changeThis = dislikes[x];
            document.getElementById("yourdislikes").innerHTML += dislikes[x].name + "<p class='ch'>change list</p><br><br>";
            let ch = document.querySelectorAll('.ch');
            for (i = 0; i < ch.length; i++) {
                let z = i;
                ch[i].addEventListener('click', function () {
                    likes.push(dislikes[z]);
                    localStorage.setItem("likes", JSON.stringify(likes));
                    dislikes.splice(z, 1);
                    localStorage.setItem("dislikes", JSON.stringify(dislikes));
                    document.querySelectorAll('.yourlikes')[0].style.left = "100%";
                })
            }
        }
    }
    for (v = 0; v < likes.length; v++) {
        if (likes.length > 0) {
            let ChangeThat = likes[v];
            document.getElementById("yourlikes").innerHTML += likes[v].name + "<p class='co'>change list</p><br><br>";
            let co = document.querySelectorAll('.co');
            for (o = 0; o < co.length; o++) {
                let q = o;
                co[q].addEventListener('click', function () {
                    console.log(dislikes)
                    dislikes.push(likes[q]);
                    localStorage.setItem("dislikes", JSON.stringify(dislikes));
                    likes.splice(q, 1);
                    localStorage.setItem("likes", JSON.stringify(likes));
                    document.querySelectorAll('.yourlikes')[0].style.left = "100%";
                })
            }
        }
    }
})
document.getElementById("goAwayclick").addEventListener('click', function () {
    document.querySelectorAll('.yourlikes')[0].style.left = "100%";
})



function dislike() {
    if (people.length <= 1) {
        dislikes.push(people[0]);
        console.log(dislikes);
        people.shift();
        localStorage.removeItem("people");
        location.reload();
        console.log("er zijn er nie veel meer");
    } else {
        if (localStorage.getItem("dislikes") !== null) {
            dislikes = JSON.parse(localStorage.getItem("dislikes"));
            dislikes.push(people[0]);
            console.log(dislikes);
            people.shift();
            showPeople();
            localStorage.setItem("people", JSON.stringify(people));
            localStorage.setItem("dislikes", JSON.stringify(dislikes));
        } else {
            dislikes.push(people[0]);
            console.log(dislikes);
            people.shift();
            showPeople();
            localStorage.setItem("people", JSON.stringify(people));
            localStorage.setItem("dislikes", JSON.stringify(dislikes));
        }
    }
}

function like() {
    if (people.length <= 1) {
        likes.push(people[0]);
        console.log(likes);
        people.shift();
        localStorage.removeItem("people");
        location.reload();
        console.log("er zijn er nie veel meer");
    } else {
        if (localStorage.getItem("likes") !== null) {
            likes = JSON.parse(localStorage.getItem("likes"));
            likes.push(people[0]);
            console.log(likes);
            people.shift();
            showPeople();
            localStorage.setItem("people", JSON.stringify(people));
            localStorage.setItem("likes", JSON.stringify(likes));
        } else {
            likes.push(people[0]);
            console.log(likes);
            people.shift();
            showPeople();
            localStorage.setItem("people", JSON.stringify(people));
            localStorage.setItem("likes", JSON.stringify(likes));
        }
    }
}

function showPeople() {
    document.getElementById("image").src = people[0].picture;
    document.getElementById("name").innerHTML = people[0].name;
    document.getElementById("age").innerHTML = people[0].age;
    document.getElementById("location").innerHTML = people[0].place;;
    var output = document.getElementById("out");

    function succes(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        let lat1 = people[0].lat;
        let lon1 = people[0].long;
        let lat2 = latitude;
        let lon2 = longitude;
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
        let x = Math.round(12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
        console.log(x);
        document.getElementById("output").innerHTML = "the distance to this person is " + x + " km";
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }
    navigator.geolocation.getCurrentPosition(succes, error);

    map.flyTo({
        center: [
            people[0].long, people[0].lat]
    });
    let radius = 50; //radius of the circle

    let longpeop = people[0].long;
    let latpeop = people[0].lat;
    if (map.isStyleLoaded()) {
        map.addSource("geomarker" + i, { //making a source for the radius
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [longpeop, latpeop]
                    }
            }]
            }
        });
        map.addLayer({ //displaying the radius of the circle
            "id": "geomarker" + i,
            "type": "circle",
            "source": "geomarker" + i,
            "paint": {
                "circle-radius": radius, //radius with the variable radius
                "circle-color": "#3BBB87", //color
                "circle-opacity": 0.5, //opacity
            }
        });
        i++;



    }
}