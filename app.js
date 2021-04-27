import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { renderFile } from 'ejs';


// importing express
import express from "express";
const app = express();

// importing body-parser
import pkg from "body-parser";
const { urlencoded } = pkg;
app.use(urlencoded({ extended: true }));

// to server static files
// app.use(express.static(__dirname));

// to render the html files
app.engine('html', renderFile);

import { get } from "https";

app.get("/", function (req, res) {
    var check = 0;
    res.sendFile(__dirname + "/index.html", { check: check });
});

app.post("/", function (req, res) {
    var check = 1;
    var city = req.body.city;

    const url = "https://api.openweathermap.org/data/2.5/weather?appid={yourAPIkey}&q=" + city + "&units=metric";
    const mapURL = "https://www.google.com/maps/embed/v1/place?q=" + city + "&key={yourAPIkey}";

    get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            var status;

            // undefined means there exists a city for weather api
            if (weatherData.message == undefined) {
                status = 1;
            } else {
                status = 0;
            }

            if (status == 1) {
                console.log(weatherData.message, status);
                const longi = weatherData.coord.lon;
                const lati = weatherData.coord.lat;
                const desc = weatherData.weather[0].description;
                const temp = weatherData.main.temp;
                const speed = weatherData.wind.speed;
                res.render(__dirname + "/index.html", { longi: longi, lati: lati, desc: desc, temp: temp, speed: speed, mapURL: mapURL, check: check });
            } else {
                res.sendFile(__dirname + "/error.html");
            }
            // res.write("<h1>" + temp + "</h1>");
            // res.send();
        });

        // console.log(response);
    });
    // res.send("Server is good to go");
});


// heroku will define the port number on the go
// maybe at 3000, 5000 at any port or at 3000
// while running locally
app.listen(process.env.PORT || 3000, function () {
    console.log("Server Started at port number 3000");
});