const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  sendMessage,
  getChats,
  getChatById,
  deleteChat,
} = require("../controllers/chat.controller");

const router = express.Router();

router.post(
  "/message",
  protect,
  sendMessage
);

router.get(
  "/",
  protect,
  getChats
);

router.get(
  "/:id",
  protect,
  getChatById
);

router.delete(
  "/:id",
  protect,
  deleteChat
);

module.exports = router;