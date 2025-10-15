"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  contexts?: string[];
}

interface ApiResponse {
  answer: string;
  contexts?: string[];
  success: boolean;
  error?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.answer,
          role: "assistant",
          timestamp: new Date(),
          contexts: data.contexts,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Error: ${data.error || "Failed to get response"}`,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Error: Failed to connect to the server",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-semibold">PDF Assistant</h2>
            <p className="text-blue-100 text-sm">
              Ask questions about your document
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Welcome! Ask me anything about your PDF document.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                } rounded-2xl px-4 py-3`}
              >
                <div className="flex items-start space-x-3">
                  {message.role === "assistant" && (
                    <Bot className="h-5 w-5 mt-1 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.contexts && message.contexts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Sources:
                        </p>
                        <div className="space-y-1">
                          {message.contexts
                            .slice(0, 2)
                            .map((context, index) => (
                              <p
                                key={index}
                                className="text-xs text-gray-600 bg-gray-50 p-2 rounded"
                              >
                                {context.length > 150
                                  ? context.substring(0, 150) + "..."
                                  : context}
                              </p>
                            ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs mt-2 opacity-70">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <User className="h-5 w-5 mt-1 text-blue-200 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-3">
                <Bot className="h-5 w-5 mt-1 text-gray-500" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-gray-600">Thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your PDF..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
