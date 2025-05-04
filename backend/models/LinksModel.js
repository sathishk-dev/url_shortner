const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    longLink: {
        type: String,
        required: true
    },
    shortLink: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    qr: {
        type: String,
        required: true
    },
    delete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const linkModel = mongoose.model("short_links", linkSchema);
module.exports = linkModel;