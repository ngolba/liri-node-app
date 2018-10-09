/// Globals  /////////
require("dotenv").config();
const fs = require('fs');
const keys = require("./keys");
const moment = require('moment');
const request = require('request');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
let command = process.argv[2];
const acceptableCommands = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];
//////////////////////////////////////

// Log initial input to log.txt ////
let cmdLineText = '';
for (let i = 2; i < process.argv.length; i++) {
    cmdLineText += `${process.argv[i]} `
}
fs.appendFile('log.txt', `${cmdLineText}\n\n`, 'utf8', () => {});
///////////////////////////////

// Console.log data and store to log.txt //
const logAndPrintData = (data) => {
    console.log(data)
    fs.appendFile('log.txt', (data + '\n'), 'utf8', () => {});
}
/////////////////////////////////////////

// Format input for API use ///////
const processInput = (divider, input, minLength) => {
    let outputString = input[minLength];
    if (input.length === (minLength + 1)) {
        return outputString;
    } else {
        outputString = (input.slice(minLength)).join(divider)
        return outputString;
    }
}
/////////////////////////////////

// Bands in Town API ///////
const concertThis = (input, minLength) => {
    let artist = processInput('%20', input, minLength);
    let queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`

    request(queryUrl, function (error, response, body) {
        if (error) {
            logAndPrintData("Error. Please try again.\n")
            return;
        }

        let bandInfo = JSON.parse(body);
        if (!bandInfo[0]) {
            logAndPrintData("No upcoming Events\n")
            return;
        }

        let event = {};
        for (let i = 0; i < bandInfo.length; i++) {
            event = bandInfo[i]
            logAndPrintData(`Venue: ${event.venue.name} \nLocation: ${event.venue.city}, ${event.venue.region}  \nDate: ${moment(event.datetime).format("MM/DD/YYYY")} \n`)
        }
    });
}
//////////////////////////////

// Spotify through node-spotify-api 
const spotifyThis = (input, minLength) => {
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

    if (!input[minLength]) {
        spotify
            .request("https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc")
            .then((data) => {
                fillData(data);
                logAndPrintData(`Song Name: ${songName} \nArtist(s): ${artists} \nPreview URL: ${previewUrl} \nAlbum Title: ${album} \n`);
            })
    } else {
        songName = processInput(' ', input, minLength)
        spotify
            .search({
                type: 'track',
                query: songName,
                limit: 1
            })
            .then(function (response) {
                fillData(response.tracks.items[0]);
                logAndPrintData(`Song Name: ${songName} \nArtist(s): ${artists} \nPreview URL: ${previewUrl} \nAlbum Title: ${album} \n`);
            })
    }
}
///////////////////////////////////

// OMDb API ///////////////////////
const movieThis = (input, minLength) => {
    let movieQuery = '';
    if (!input[minLength]) {
        movieQuery = `http://www.omdbapi.com/?apikey=trilogy&i=tt0485947`
    } else {
        movieQuery = `http://www.omdbapi.com/?apikey=trilogy&t=${processInput('+', input, minLength)}`
    }

    request(movieQuery, (error, response, body) => {
        if (error) {
            logAndPrintData("Error. Please try again.\n")
            return;
        }
        let movieInfo = JSON.parse(body);
        logAndPrintData(`Title: ${movieInfo.Title} \nYear: ${movieInfo.Year} \nIMDb Rating: ${movieInfo.imdbRating} \nRotten Tomatoes Rating: ${movieInfo.Ratings[1].Value} \nCountry: ${movieInfo.Country} \nLanguage: ${movieInfo.Language} \nPlot: ${movieInfo.Plot} \nActors: ${movieInfo.Actors}\n`)
    })
}
//////////////////////////////////


if (command === "concert-this") {
    concertThis(process.argv, 3);
} else if (command === "spotify-this-song") {
    spotifyThis(process.argv, 3);
} else if (command === "movie-this") {
    movieThis(process.argv, 3)
} else if (command === "do-what-it-says") {
    fs.readFile('random.txt', 'utf-8', (err, data) => {
        if (err) {
            console.log("Error")
            return;
        }

        let fileText = (JSON.stringify(data)).replace(/["'\\]/g, '');
        let fileInputs = fileText.split(',');
        command = fileInputs[0];
        let itemName = fileInputs[1].split(' ');

        if (command === "concert-this") {
            concertThis(itemName, 0);
        } else if (command === "spotify-this-song") {
            spotifyThis(itemName, 0);
        } else if (command === "movie-this") {
            movieThis(itemName, 0)
        } else {
            console.log("Command not recognized.")
        }
    })
} else {
    console.log(`Command not recognized. Acceptable Commands are: \n${acceptableCommands[0]} \n${acceptableCommands[1]} \n${acceptableCommands[2]} \n${acceptableCommands[3]}`)
}