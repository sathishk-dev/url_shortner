const fs = require('fs');
const path = require('path');
const shortId = require("shortid");
const cloudinary = require('cloudinary').v2;
const qr = require("qr-image");
const linkModel = require("../models/LinksModel");
const mongoose = require('mongoose');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const createShortLink = async (req, res) => {
    const { longLink } = req.body;

    try {
        shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
        const shortLink = shortId.generate();

        const qrChunks = [];
        const qr_png = qr.image(`${process.env.SERVER_URL}/${shortLink}`, { type: 'png' });

        qr_png.on('data', (chunk) => qrChunks.push(chunk));

        qr_png.on('end', async () => {
            const qrBuffer = Buffer.concat(qrChunks);

            cloudinary.uploader.upload_stream(
                { folder: 'short-links' },
                async (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        return res.status(500).json({ success: false, message: "Failed to upload QR" });
                    }

                    const newLink = await linkModel.create({
                        longLink,
                        shortLink,
                        qr: result.secure_url,
                    });

                    res.status(200).json({
                        success: true,
                        data: newLink
                    });
                }
            ).end(qrBuffer);
        });

    } catch (error) {
        console.log("Error generating link: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const updateClicks = async (req, res) => {
    const url = req.params.shortUrl;

    try {
        const shortUrl = await linkModel.findOne({ shortLink: url });
        if (shortUrl == null) return res.status(404).json({ success: false, message: "URL Not Found" });

        shortUrl.clicks++;
        await shortUrl.save();

        res.redirect(shortUrl.longLink);
    }
    catch (error) {
        console.log("Error update clicks: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const getShortLinks = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            return res.status(400).json({ success: false, message: "No valid IDs provided" });
        }

        const links = await linkModel
            .find({
                _id: { $in: validIds },
                delete: false
            })
            .sort({ createdAt: -1 });


        res.status(200).json({ success: true, data: links });
    }
    catch (error) {
        console.log("Error getting links: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const deleteLinks = async (req, res) => {
    try {
        const { linkId } = req.params;

        const link = await linkModel.findById(linkId);
        if (!link) {
            return res.status(404).json({ success: false, message: "Link not found" });
        }

        link.delete = true;
        await link.save();

        res.status(200).json({ success: true, message: "Link deleted successfully" });
    }
    catch (error) {
        console.log("Error soft deleting link: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}


module.exports = { createShortLink, updateClicks, getShortLinks, deleteLinks }