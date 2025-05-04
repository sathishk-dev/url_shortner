const fs = require('fs');
const path = require('path');
const shortId = require("shortid");
const qr = require("qr-image");
const linkModel = require("../models/LinksModel");
const mongoose = require('mongoose');


const createShortLink = async (req, res) => {
    const { longLink } = req.body;

    try {
        
        shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
        const shortLink = shortId.generate();

        const qr_png = qr.image(`${process.env.SERVER_URL}/${shortLink}`, { type: 'png' });

        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const qrFileName = `${shortLink}.png`;
        const qrFilePath = path.join(uploadDir, qrFileName);
        const qrStream = fs.createWriteStream(qrFilePath);
        qr_png.pipe(qrStream);

        qrStream.on('finish', async () => {
            // Save in DB after QR is saved
            const newLink = await linkModel.create({
                longLink,
                shortLink,
                qr: `${process.env.SERVER_URL}/uploads/${qrFileName}`,
            });

            res.status(200).json({
                success: true,
                data: newLink
            });
        });

    }
    catch (error) {
        console.log("Error generating link: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

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