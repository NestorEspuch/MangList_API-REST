const https = require("https");

function getAllMangas(limit, callback) {
    const options = {
        hostname: "myanimelist.net",
        path: "https://api.myanimelist.net/v0/manga/ranking?ranking_type=manga&limit=" + limit,
        method: "GET",
        headers: {
            "-H": "Authorization: Bearer 1a54c9041df6a56071706bb0e6b29d24"
        }
    };

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", d => {
            callback(JSON.parse(d));
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.end();
}

function getAllManhwa(limit, callback) {
    const options = {
        hostname: "myanimelist.net",
        path: "https://api.myanimelist.net/v0/manga/ranking?ranking_type=manhwa&limit=" + limit,
        method: "GET",
        headers: {
            "-H": "Authorization: Bearer 1a54c9041df6a56071706bb0e6b29d24"
        }
    };

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", d => {
            callback(JSON.parse(d));
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.end();
}

function getAllManhua(limit, callback) {
    const options = {
        hostname: "myanimelist.net",
        path: "https://api.myanimelist.net/v0/manga/ranking?ranking_type=manhua&limit=" + limit,
        method: "GET",
        headers: {
            "-H": "Authorization: Bearer 1a54c9041df6a56071706bb0e6b29d24"
        }
    };

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", d => {
            callback(JSON.parse(d));
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.end();
}

module.exports = { getAllMangas, getAllManhua, getAllManhwa };

