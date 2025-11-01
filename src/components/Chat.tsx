"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessagePanelProps } from "../lib/types";
import { Send, Trash2, MessageCircle, Clock, AlertCircle } from "lucide-react";
import { TimeHelpers } from "../helpers/timeHelpers";
import { cn } from "../helpers/cn";

const Chat = ({
  messages,
  currentUserId,
  onSendMessage,
  onDeleteMessage,
  onTyping,
}: MessagePanelProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [expiresIn, setExpiresIn] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [, forceUpdate] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const hasExpiringMessages = messages.some(
      (msg) => msg.expiresAt && msg.expiresAt > Date.now()
    );
    if (hasExpiringMessages) {
      const interval = setInterval(() => {
        forceUpdate((prev) => prev + 1);
      }, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [messages]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessageInput(e.target.value);

      if (!isTyping && e.target.value.length > 0) {
        setIsTyping(true);
        onTyping(true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    },
    [isTyping, onTyping]
  );

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedMessage = messageInput.trim();
      if (!trimmedMessage) return;

      const expirationSeconds = expiresIn ? parseInt(expiresIn, 10) : undefined;
      onSendMessage(trimmedMessage, expirationSeconds);

      setMessageInput("");
      setExpiresIn("");
      setIsTyping(false);
      onTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    },
    [messageInput, expiresIn, onSendMessage, onTyping]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e as React.FormEvent);
      }
    },
    [handleSendMessage]
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold">Chat</h2>
          {messages.length > 0 && (
            <span className="px-2.5 py-1 text-xs font-medium border border-blue-600 text-blue-600 rounded">
              {messages.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow flex flex-col p-0 min-h-0">
        <div className="flex-grow overflow-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-600">
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => {
                const isOwnMessage = message.userId === currentUserId;
                const expirationText = TimeHelpers.getExpirationText(
                  message.expiresAt
                );
                const isExpired = TimeHelpers.isMessageExpired(
                  message.expiresAt
                );

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3",
                      isOwnMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isOwnMessage && (
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div
                      className={cn(
                        "p-2 max-w-[70%] rounded-lg shadow-sm relative",
                        isOwnMessage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold">
                          {message.username}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            isOwnMessage ? "opacity-70" : "text-gray-600"
                          )}
                        >
                          {TimeHelpers.formatTimestamp(message.timestamp)}
                        </span>
                        {isOwnMessage && !isExpired && (
                          <button
                            type="button"
                            onClick={() => onDeleteMessage(message.id)}
                            className={cn(
                              "top-2 right-1 opacity-70 hover:opacity-100 p-1.5 rounded",
                              isOwnMessage
                                ? "text-white hover:bg-blue-700"
                                : "text-gray-600 hover:bg-gray-200"
                            )}
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="mb-2">
                        {isExpired ? (
                          <div className="flex items-center gap-1 text-sm">
                            <AlertCircle size={16} />
                            <span>Message has expired</span>
                          </div>
                        ) : (
                          <p
                            className={cn(
                              "text-sm leading-relaxed whitespace-pre-wrap break-words",
                              isOwnMessage ? "text-white" : "text-gray-900"
                            )}
                          >
                            {message.content}
                          </p>
                        )}
                      </div>

                      {expirationText && !isExpired && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 text-xs font-medium border border-yellow-500 text-yellow-600 rounded">
                          <Clock size={12} />
                          {expirationText}
                        </span>
                      )}
                    </div>

                    {isOwnMessage && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200" />

        <div className="p-6">
          <form onSubmit={handleSendMessage}>
            <div className="space-y-4 mt-10">
              <textarea
                className="w-full px-6 py-5 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm placeholder:text-gray-400"
                rows={4}
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />

              <div className="flex gap-3 items-center">
                <div className="relative flex-shrink-0">
                  <Clock
                    className="absolute left-35 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                  <input
                    type="number"
                    className="w-[180px] pl-[10px] pr-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-400"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    placeholder="Expire in (sec)"
                    min={1}
                    max={3600}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={cn(
                    "px-5 py-3 rounded-md transition-colors flex items-center justify-center min-w-[48px]",
                    messageInput.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <Send size={22} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { Chat };
