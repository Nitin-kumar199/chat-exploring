const express = require("express");

const { createChat, findChat, findUserchats} = require("../controllers/chatController");
const router = express.Router();

router.post("/", createChat );
router.get("/:userId", findUserchats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;