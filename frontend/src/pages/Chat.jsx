import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useStartChatMutation,
  useSendMessageMutation,
} from "../store/api/apiSlice";
import { Send, LogOut, ArrowLeft, Brain, Star, FileText } from "lucide-react";
import toast from "react-hot-toast";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [showCitations, setShowCitations] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);

  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // RTK Query hooks
  const [startChat, { isLoading: isStartingChat }] = useStartChatMutation();
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  const loading = isStartingChat || isSendingMessage;

  useEffect(() => {
    startNewSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewSession = async () => {
    try {
      const response = await startChat().unwrap();
      const { sessionId, message, questions } = response;

      setSessionId(sessionId);
      setMessages([
        {
          role: "assistant",
          content: message,
          timestamp: new Date(),
        },
      ]);

      if (questions && questions.length > 0) {
        setCurrentQuestion(questions[0]);
      }
    } catch (error) {
      toast.error("Failed to start chat session");
      console.error("Start session error:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");

    try {
      const response = await sendMessage({
        message: messageToSend,
        sessionId,
      }).unwrap();

      const { response: aiResponse, score, feedback, citations } = response;

      const assistantMessage = {
        role: "assistant",
        content: aiResponse,
        score,
        feedback,
        citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Send message error:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBack = () => {
    navigate("/upload");
  };

  const showCitationModal = (citation) => {
    setSelectedCitation(citation);
    setShowCitations(true);
  };

  const closeCitationModal = () => {
    setShowCitations(false);
    setSelectedCitation(null);
  };

  const formatMessage = (message) => {
    // Simple markdown-like formatting for bold text
    return message.content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="flex items-center text-gray-700 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Interview Practice
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-primary-600 mr-2" />
                    <span className="text-xs font-medium text-gray-600">
                      AI Interviewer
                    </span>
                  </div>
                )}

                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message),
                  }}
                />

                {message.score && (
                  <div className="mt-2 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">
                      Score: {message.score}/10
                    </span>
                  </div>
                )}

                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => showCitationModal(message.citations)}
                      className="text-xs text-primary-600 hover:text-primary-800 underline"
                    >
                      View sources ({message.citations.length})
                    </button>
                  </div>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 text-primary-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response here..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Citation Modal */}
      {showCitations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Relevant Sources
                </h3>
                <button
                  onClick={closeCitationModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedCitation?.map((citation, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center mb-2">
                      <FileText className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Source {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{citation.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
