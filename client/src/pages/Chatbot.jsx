import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function Chatbot() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] =
    useState(null);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  // Load previous chats
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response =
        await api.get("/chat");

      setChats(
        response.data.chats || []
      );
    } catch (error) {
      console.error(
        "Failed to load chats:",
        error
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  // Open an existing chat
  const openChat = async (chatId) => {
    try {
      const response =
        await api.get(
          `/chat/${chatId}`
        );

      setCurrentChatId(chatId);

      setMessages(
        response.data.chat?.messages ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to open chat:",
        error
      );
    }
  };

  // Start a new conversation
  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
  };

  // Send message
  const sendMessage = async (event) => {
    event.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    const message = input.trim();

    setInput("");
    setLoading(true);

    // Show user message immediately
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: message,
      },
    ]);

    try {
      const response =
        await api.post(
          "/chat/message",
          {
            message,
            chatId: currentChatId,
          }
        );

      setCurrentChatId(
        response.data.chatId
      );

      setMessages(
        response.data.messages || []
      );

      await fetchChats();
    } catch (error) {
      console.error("================================");
      console.error("CHATBOT REQUEST FAILED");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);
      console.error("URL:", error.config?.url);
      console.error("Base URL:", error.config?.baseURL);
      console.error("================================");
      

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I could not process your question. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Delete chat
  const deleteChat = async (
    chatId,
    event
  ) => {
    event.stopPropagation();

    try {
      await api.delete(
        `/chat/${chatId}`
      );

      if (currentChatId === chatId) {
        startNewChat();
      }

      await fetchChats();
    } catch (error) {
      console.error(
        "Failed to delete chat:",
        error
      );
    }
  };

  return (
    <div className="chatbot-page">

      {/* ================= HEADER ================= */}

      <header className="chatbot-header">

        <div className="chatbot-brand">

          <Link
            to="/dashboard"
            className="chatbot-back"
          >
            ← Dashboard
          </Link>

          <div>
            <h1>
              EduBridge AI
            </h1>

            <p>
              AI-powered doubt solving
            </p>
          </div>

        </div>

        <button
          className="chatbot-new-button"
          onClick={startNewChat}
        >
          + New Chat
        </button>

      </header>


      {/* ================= CHAT LAYOUT ================= */}

      <main className="chatbot-layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="chatbot-sidebar">

          <div className="chatbot-sidebar-header">

            <h2>
              Chat History
            </h2>

            <button
              onClick={startNewChat}
            >
              +
            </button>

          </div>


          {historyLoading ? (

            <p className="chat-history-empty">
              Loading chats...
            </p>

          ) : chats.length === 0 ? (

            <p className="chat-history-empty">
              No previous chats
            </p>

          ) : (

            <div className="chat-history-list">

              {chats.map((chat) => (

                <div
                  key={chat._id}
                  className={`chat-history-item ${
                    currentChatId === chat._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    openChat(chat._id)
                  }
                >

                  <div className="chat-history-content">

                    <span className="chat-history-icon">
                      💬
                    </span>

                    <span className="chat-history-title">
                      {chat.title ||
                        "New Chat"}
                    </span>

                  </div>

                  <button
                    className="chat-delete-button"
                    onClick={(event) =>
                      deleteChat(
                        chat._id,
                        event
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

          )}

        </aside>


        {/* ================= CHAT AREA ================= */}

        <section className="chatbot-main">

          <div className="chat-messages">

            {messages.length === 0 ? (

              <div className="chatbot-welcome">

                <div className="chatbot-welcome-icon">
                  🤖
                </div>

                <h2>
                  How can I help you?
                </h2>

                <p>
                  Ask me questions about
                  React, Node.js, MongoDB,
                  Python, Machine Learning,
                  Generative AI, RAG and
                  other EduBridge topics.
                </p>


                <div className="suggestion-grid">

                  <button
                    onClick={() =>
                      setInput(
                        "What is React and why is it used?"
                      )
                    }
                  >
                    What is React?
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "Explain Node.js in simple terms"
                      )
                    }
                  >
                    Explain Node.js
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "What is MongoDB?"
                      )
                    }
                  >
                    What is MongoDB?
                  </button>

                  <button
                    onClick={() =>
                      setInput(
                        "What is RAG in Generative AI?"
                      )
                    }
                  >
                    Explain RAG
                  </button>

                </div>

              </div>

            ) : (

              messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={`chat-message ${
                      message.role ===
                      "user"
                        ? "user-message"
                        : "assistant-message"
                    }`}
                  >

                    <div className="message-avatar">

                      {message.role ===
                      "user"
                        ? "👤"
                        : "🤖"}

                    </div>

                    <div className="message-content">

                      <span className="message-role">

                        {message.role ===
                        "user"
                          ? "You"
                          : "EduBridge AI"}

                      </span>

                      <p>
                        {message.content}
                      </p>

                    </div>

                  </div>

                )
              )

            )}


            {loading && (

              <div className="chat-message assistant-message">

                <div className="message-avatar">
                  🤖
                </div>

                <div className="message-content">

                  <span className="message-role">
                    EduBridge AI
                  </span>

                  <p className="typing-indicator">
                    Thinking...
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* ================= INPUT ================= */}

          <form
            className="chatbot-input-area"
            onSubmit={sendMessage}
          >

            <input
              type="text"
              placeholder="Ask EduBridge AI a question..."
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              disabled={loading}
            />

            <button
              type="submit"
              disabled={
                loading ||
                !input.trim()
              }
            >
              {loading
                ? "..."
                : "Send"}
            </button>

          </form>

          <p className="chatbot-disclaimer">
            EduBridge AI uses your learning
            knowledge base to provide
            educational answers.
          </p>

        </section>

      </main>

    </div>
  );
}

export default Chatbot;