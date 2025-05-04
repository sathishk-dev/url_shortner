const router = require("express").Router();
const { createShortLink, getShortLinks, deleteLinks } = require("../controller/linkController");

router.post("/create", createShortLink);
router.post("/getlinks", getShortLinks);
router.delete("/delete/:linkId", deleteLinks);

module.exports = router;