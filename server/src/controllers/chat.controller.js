const Chat = require("../models/chat.model");

const {
  generateAnswer,
} = require("../services/rag.service");

// =====================================================
// Create a new chat and send a message
// =====================================================
const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let chat;

    // Find existing chat if chatId is provided
    if (chatId) {
      chat = await Chat.findOne({
        _id: chatId,
        user: req.user._id,
      });
    }

    // Create a new chat if no existing chat was found
    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        title: message.trim().substring(0, 50),
        messages: [],
      });
    }

    // Get previous conversation history
    const history = chat.messages;

    console.log("----------------------------------------");
    console.log("AI CHAT REQUEST");
    console.log("User:", req.user.email);
    console.log("Question:", message.trim());
    console.log("Chat ID:", chat._id);
    console.log("Previous messages:", history.length);

    // Generate AI answer using RAG service
    const answer = await generateAnswer(
      message.trim(),
      history
    );

    console.log("AI RESPONSE GENERATED");
    console.log("----------------------------------------");

    // Save user message
    chat.messages.push({
      role: "user",
      content: message.trim(),
    });

    // Save assistant response
    chat.messages.push({
      role: "assistant",
      content: answer,
    });

    await chat.save();

    res.status(200).json({
      success: true,
      chatId: chat._id,
      answer,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("========================================");
    console.error("CHAT ERROR");
    console.error("========================================");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:");
    console.error(error.stack);
    console.error("========================================");

    res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};


// =====================================================
// Get user's chat history
// =====================================================
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user._id,
    })
      .select(
        "title messages createdAt updatedAt"
      )
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(
      "Get chats error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch chat history",
    });
  }
};


// =====================================================
// Get one conversation
// =====================================================
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(
      "Get chat error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
    });
  }
};


// =====================================================
// Delete conversation
// =====================================================
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete chat error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete chat",
    });
  }
};


// =====================================================
// Export controllers
// =====================================================
module.exports = {
  sendMessage,
  getChats,
  getChatById,
  deleteChat,
};