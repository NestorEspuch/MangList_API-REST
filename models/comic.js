const mongoose = require("mongoose");

// Definicion del esquema y modelo
let comicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    main_picture: {
        type: String,
        required: true,
    },
    alternative_titles: {
        type: Array[String],
        required: false,
    },
    start_date: {
        type: String,
        required: false,
    },
    end_date: {
        type: String,
        required: false,
    },
    synopsis: {
        type: String,
        required: false,
    },
    mean: {
        type: Number,
        required: false,
    },
    rank: {
        type: Number,
        required: false,
    },
    popularity: {
        type: Number,
        required: false,
    },
    num_list_users: {
        type: Number,
        required: true,
    },
    num_scoring_users: {
        type: Number,
        required: true,
    },
    nsfw: {
        type: String,
        required: false,
    },
    genres: {
        type: Array[String],
        required: true,
    },
    created_at: {
        type: String,
        required: true,
    },
    updated_at: {
        type: String,
        required: true,
    },
    media_type: {
        type: String,
        enum: ["Manga", "Novel", "One Shot", "Doujinshi", "Manhwa", "Manhua", "OEL", "Light Novel", "Webtoon", "Unknown"],
    },
    status: {
        type: String,
        enum: ["Publishing", "Finished", "Not yet published", "Unknown"],
    },
    my_list_status: {
        type: Object,
        required: false,
    },
    num_volumes: {
        type: Number,
        required: true,
    },
    num_chapters: {
        type: Number,
        required: true,
    },
    authors: {
        type: Array[String],
        required: true,
    },
    pictures: {
        type: Array[String],
        required: true,
    },
    background: {
        type: String,
        required: false, 
    },
    related_anime: {
        type: Array[String],
        required: false,
    },
    related_manga: {
        type: Array[String],
        required: false,
    },
    recommendations: {
        type: Array[String],
        required: false,
    },
    serialization: {
        type: Array[String],
        required: false,
    }
});

let comic = mongoose.model("comic", comicSchema);

module.exports = comic;
