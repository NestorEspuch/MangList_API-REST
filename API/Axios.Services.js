const axios = require("axios");
const https = require("https");
// const jsonCombined = require("../shared/JsonCombined.js");

const TOKEN = "949a10563a5ac63679446759eab1ac84";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // (NOTE: this will disable client verification)
});

async function getAllMangas() {
    try {
        let responseManga = await axios.get("https://api.myanimelist.net/v0/manga/ranking?ranking_type=manga&limit=10", {
            headers: {
                "-H": "Authorization: Bearer " + TOKEN,
            },
            responseType: "json",
            httpsAgent,
        });

        let responseManhua = await axios.get("https://api.myanimelist.net/v0/manga/ranking?ranking_type=manhua&limit=20", {
            headers: {
                "-H": "Authorization: Bearer " + TOKEN,
            },
            responseType: "json",
            httpsAgent,
        });

        let responseManhwa = await axios.get("https://api.myanimelist.net/v0/manga/ranking?ranking_type=manhwa&limit=30", {
            headers: {
                "-H": "Authorization: Bearer " + TOKEN,
            },
            responseType: "json",
            httpsAgent,
        });
        
        // return jsonCombined.convertToJson([responseManga.data, responseManhua.data, responseManhwa.data]);
        return Object.assign(responseManga.data, responseManhua.data, responseManhwa.data);
    } catch (error) {
        console.error(error);
    }
}

async function getComicId(id = "1") {
    try {
        let response = await axios.get("https://api.myanimelist.net/v0/manga/" + id + "?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name},pictures,background,related_anime,related_manga,recommendations,serialization{name}", {
            headers: {
                "-H": "Authorization: Bearer " + TOKEN,
            },
            responseType: "json",
            httpsAgent,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getAllMangas, getComicId };