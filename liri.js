require("dotenv").config();
const fs = require('fs');
const keys = require("./keys");
const moment = require('moment');
const request = require('request');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const acceptableCommands = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];
if (!acceptableCommands.includes(command)) {
    console.log(`Command not recognized. Acceptable Commands are: \n${acceptableCommands[0]} \n${acceptableCommands[1]} \n${acceptableCommands[2]} \n${acceptableCommands[3]}`)
}

const processInput = (divider, input) => {
    let outputString = input[3];

    if (input.length === 4) {
        return outputString;
    } else {
        for (let i = 4; i < input.length; i++) {
            outputString += (divider + input[i]);
        }
        return outputString;
    }
}

if (command === "concert-this") {
    let artist = processInput('%20', process.argv);
    let queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`

    request(queryUrl, function (error, response, body) {
        if (error) {
            console.log("Error. Please try again")
            return;
        }

        let bandInfo = JSON.parse(body);
        if (!bandInfo[0]) {
            console.log("No upcoming Events")
            return;
        }

        let event = {};
        for (let i = 0; i < bandInfo.length; i++) {
            event = bandInfo[i]
            console.log(`Venue: ${event.venue.name}`)
            console.log(`Location: ${event.venue.city}, ${event.venue.region}`)
            console.log(`Date: ${moment(event.datetime).format("MM/DD/YYYY")} \n`)
        }
    });
} else if (command === "spotify-this-song") {
    let songName = '';
    let artists = '';
    let previewUrl = '';
    let album = '';

    const findArtists = (response) => {
        let allArtists = [];
        for (let i = 0; i < response.artists.length; i++) {
            allArtists.push(response.artists[i].name)
        }
        return allArtists.join(', ')
    };
    const fillData = (data) => {
        songName = data.name;
        artists = findArtists(data);
        previewUrl = data.preview_url;
        album = data.album.name;
    }
    const printData = () => console.log(`Song Name: ${songName} \nArtist(s): ${artists} \nPreview URL: ${previewUrl} \nAlbum Title: ${album}`)

    if (!process.argv[3]) {
        spotify
            .request("https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc")
            .then((data) => {
                fillData(data);
                printData();
            })
    } else {
        songName = processInput(' ', process.argv)
        spotify
            .search({
                type: 'track',
                query: songName,
                limit: 1
            })
            .then(function (response) {
                fillData(response.tracks.items[0]);
                printData();
            })
    }



} else if (command === "movie-this") {
    let movieQuery = '';
    if (!process.argv[3]){
        movieQuery = `http://www.omdbapi.com/?apikey=trilogy&i=tt0485947`
    } else {
        movieQuery = `http://www.omdbapi.com/?apikey=trilogy&t=${processInput('+', process.argv)}`
    }
    
    request(movieQuery, (error, response, body) => {
        if (error) {
            console.log("Error. Please try again")
            return;
        }
        let movieInfo = JSON.parse(body);
        console.log(`Title: ${movieInfo.Title}`)
        console.log(`Year: ${movieInfo.Year}`)
        console.log(`IMDb Rating: ${movieInfo.imdbRating}`)
        console.log(`Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}`)
        console.log(`Country: ${movieInfo.Country}`)
        console.log(`Language: ${movieInfo.Language}`)
        console.log(`Plot: ${movieInfo.Plot}`)
        console.log(`Actors: ${movieInfo.Actors}`)
    })
}else if (command === "do-what-it-says") {
    
}