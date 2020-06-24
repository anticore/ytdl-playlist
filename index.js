const path = require("path");
const fs = require("fs");
const { http } = require("follow-redirects");
const { exec } = require("child_process");
require("dotenv").config();

function updateYoutubeDL(cb) {
    let downloadURL = process.env.YOUTUBEDL_URL;

    console.log(`updating youtube-dl from ${downloadURL}...`);

    const out = fs.createWriteStream(path.resolve("bin", "youtube-dl.exe"));
    http.get(downloadURL, function (response) {
        response.pipe(out);
        out.on("finish", function () {
            out.close(cb);
            console.log("finished update.");
        });
    });
}

function downloadPlaylist() {
    let playlistURL = process.env.PLAYLIST_URL;
    let saveLocation = process.env.SAVE_LOCATION;

    console.log(`downloading playlist at ${playlistURL}...`);

    exec(
        `${path.resolve(
            "bin",
            "youtube-dl.exe"
        )} --extract-audio --audio-format mp3 -o "${saveLocation}\\%(title)s.%(ext)s" ${playlistURL}`,
        function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log("Error code: " + error.code);
                console.log("Signal received: " + error.signal);
            }
            console.log("Child Process STDOUT: " + stdout);
            console.log("Child Process STDERR: " + stderr);
        }
    );
}

updateYoutubeDL(downloadPlaylist);
