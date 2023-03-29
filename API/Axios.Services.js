const axios = require("axios");
const https = require("https");
const token = "949a10563a5ac63679446759eab1ac84";

// function getAllMangas() {
//     axios.get("https://api.myanimelist.net/v0/manga/ranking?ranking_type=manga&limit=25", {
//         headers: {
//             "-H": "Authorization: Bearer " + token
//         }
//     })
//         .then(function (response) {
//             return (JSON.parse(response.data));
//         })
//         .catch(function (error) {
//             return (error);
//         });
// }

const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // (NOTE: this will disable client verification)
});

async function getDataWithBearerToken(url = "https://api.myanimelist.net/v0/manga/ranking?ranking_type=manga&limit=25") {
    try {
        let response = await axios.get(url, {
            headers: {
                "-H": "Authorization: Bearer " + token,
            },
            responseType: "json",
            httpsAgent,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function getComicId(id = "1") {
    try {
        let response = await axios.get("https://api.myanimelist.net/v0/manga/" + id + "?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name},pictures,background,related_anime,related_manga,recommendations,serialization{name}", {
            headers: {
                "-H": "Authorization: Bearer " + token,
            },
            responseType: "json",
            httpsAgent,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getDataWithBearerToken, getComicId };