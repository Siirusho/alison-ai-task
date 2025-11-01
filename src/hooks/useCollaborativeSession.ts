"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BroadcastMessage as BroadcastChannelMessage,
  useBroadcastChannel,
} from "react-broadcast-sync";
import {
  Participant,
  Message,
  CounterState,
  AppState,
  SyncMessage,
  MultiTabSyncHook,
  SyncEventType,
} from "../lib/types";
import dayjs from "dayjs";
import { TimeHelpers } from "../helpers/timeHelpers";
import { UserHelpers } from "../helpers/userHelpers";
import {
  SESSION_ID,
  USER_INACTIVE_THRESHOLD,
  TYPING_TIMEOUT,
  USER_CLEANUP_INTERVAL,
  MESSAGE_CLEANUP_INTERVAL,
} from "../constants/chatConstants";

export function useCollaborativeSession(): MultiTabSyncHook {
  const tabId = useRef(TimeHelpers.generateId("tab"));
  const userId = useRef(`user-${tabId.current}`);
  const username = useRef(UserHelpers.generateUsername());
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasInitialized = useRef(false);

  const [users, setUsers] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [counter, setCounter] = useState<CounterState>({
    value: 0,
    lastUpdatedBy: null,
    lastUpdatedAt: null,
  });
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const { messages, postMessage, clearReceivedMessages } = useBroadcastChannel(
    SESSION_ID,
    {
      sourceName: tabId.current,
    }
  );

  const cleanupExpiredMessages = useCallback(() => {
    const now = dayjs().valueOf();
    setChatMessages((prev) =>
      prev.filter((msg) => !msg.expiresAt || msg.expiresAt > now)
    );
  }, []);

  const cleanupInactiveUsers = useCallback(() => {
    const now = dayjs().valueOf();
    setUsers((prev) =>
      prev.filter(
        (user) =>
          user.id === userId.current ||
          now - user.lastActivity < USER_INACTIVE_THRESHOLD
      )
    );
  }, []);

  const sendMessage = useCallback(
    (content: string, expiresInSeconds?: number) => {
      const message: Message = {
        id: `msg-${dayjs().valueOf()}-${Math.random()}`,
        userId: userId.current,
        username: username.current,
        content,
        timestamp: dayjs().valueOf(),
        expiresAt: expiresInSeconds
          ? dayjs().add(expiresInSeconds, "second").valueOf()
          : undefined,
      };

      postMessage(SyncEventType.SEND_MESSAGE, {
        type: SyncEventType.SEND_MESSAGE,
        payload: message,
      });
      setChatMessages((prev) => [...prev, message]);

      const updatedUser: Participant = {
        id: userId.current,
        username: username.current,
        lastActivity: dayjs().valueOf(),
        isTyping: false,
        tabId: tabId.current,
      };
      postMessage(SyncEventType.PARTICIPANT_UPDATE, {
        type: SyncEventType.PARTICIPANT_UPDATE,
        payload: updatedUser,
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId.current ? updatedUser : user))
      );
    },
    [postMessage]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      postMessage(SyncEventType.REMOVE_MESSAGE, {
        type: SyncEventType.REMOVE_MESSAGE,
        payload: { messageId, userId: userId.current },
      });
      setChatMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    },
    [postMessage]
  );

  const updateCounter = useCallback(
    (increment: boolean) => {
      const newValue = counter.value + (increment ? 1 : -1);
      const update = {
        value: newValue,
        userId: userId.current,
        username: username.current,
      };

      postMessage(SyncEventType.UPDATE_COUNTER, {
        type: SyncEventType.UPDATE_COUNTER,
        payload: update,
      });
      setCounter({
        value: newValue,
        lastUpdatedBy: username.current,
        lastUpdatedAt: dayjs().valueOf(),
      });

      const updatedUser: Participant = {
        id: userId.current,
        username: username.current,
        lastActivity: dayjs().valueOf(),
        isTyping: false,
        tabId: tabId.current,
      };
      postMessage(SyncEventType.PARTICIPANT_UPDATE, {
        type: SyncEventType.PARTICIPANT_UPDATE,
        payload: updatedUser,
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId.current ? updatedUser : user))
      );
    },
    [postMessage, counter.value]
  );

  const markTyping = useCallback(
    (isTyping: boolean) => {
      if (isTyping) {
        postMessage(SyncEventType.BEGIN_TYPING, {
          type: SyncEventType.BEGIN_TYPING,
          payload: { userId: userId.current },
        });

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          postMessage(SyncEventType.END_TYPING, {
            type: SyncEventType.END_TYPING,
            payload: { userId: userId.current },
          });
        }, TYPING_TIMEOUT);
      } else {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        postMessage(SyncEventType.END_TYPING, {
          type: SyncEventType.END_TYPING,
          payload: { userId: userId.current },
        });
      }

      const updatedUser: Participant = {
        id: userId.current,
        username: username.current,
        lastActivity: dayjs().valueOf(),
        isTyping: false,
        tabId: tabId.current,
      };
      postMessage(SyncEventType.PARTICIPANT_UPDATE, {
        type: SyncEventType.PARTICIPANT_UPDATE,
        payload: updatedUser,
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId.current ? updatedUser : user))
      );
    },
    [postMessage]
  );

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const currentCollaborativeUser: Participant = {
        id: userId.current,
        username: username.current,
        lastActivity: dayjs().valueOf(),
        isTyping: false,
        tabId: tabId.current,
      };
      setUsers([currentCollaborativeUser]);
      postMessage(SyncEventType.PARTICIPANT_JOIN, {
        type: SyncEventType.PARTICIPANT_JOIN,
        payload: currentCollaborativeUser,
      });
      postMessage(SyncEventType.REQUEST_SYNC, {
        type: SyncEventType.REQUEST_SYNC,
        payload: { requesterId: userId.current },
      });
    }

    const handleBeforeUnload = () => {
      postMessage(SyncEventType.PARTICIPANT_LEAVE, {
        type: SyncEventType.PARTICIPANT_LEAVE,
        payload: { userId: userId.current },
      });
    };

    const handleVisibilityChange = () => {
      const updatedUser: Participant = {
        id: userId.current,
        username: username.current,
        lastActivity: dayjs().valueOf(),
        isTyping: false,
        tabId: tabId.current,
      };
      postMessage(SyncEventType.PARTICIPANT_UPDATE, {
        type: SyncEventType.PARTICIPANT_UPDATE,
        payload: updatedUser,
      });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId.current ? updatedUser : user))
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const cleanupInterval = setInterval(
      cleanupInactiveUsers,
      USER_CLEANUP_INTERVAL
    );
    const messageCleanupInterval = setInterval(
      cleanupExpiredMessages,
      MESSAGE_CLEANUP_INTERVAL
    );

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(cleanupInterval);
      clearInterval(messageCleanupInterval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [postMessage, cleanupInactiveUsers, cleanupExpiredMessages]);

  useEffect(() => {
    if (messages.length === 0) return;

    messages.forEach((msg: BroadcastChannelMessage) => {
      const action = msg.message as SyncMessage;

      if (
        msg.source === tabId.current &&
        [SyncEventType.SEND_MESSAGE, SyncEventType.UPDATE_COUNTER].includes(
          action.type
        )
      ) {
        return;
      }

      switch (action.type) {
        case SyncEventType.PARTICIPANT_JOIN:
          setUsers((prev) => {
            const exists = prev.some((u) => u.id === action.payload.id);
            if (exists) return prev;
            return [...prev, action.payload];
          });
          break;

        case SyncEventType.PARTICIPANT_LEAVE:
          setUsers((prev) =>
            prev.filter((u) => u.id !== action.payload.userId)
          );
          setTypingUsers((prev) =>
            prev.filter((id) => id !== action.payload.userId)
          );
          break;

        case SyncEventType.PARTICIPANT_UPDATE:
          setUsers((prev) =>
            prev.map((user) =>
              user.id === action.payload.id
                ? { ...user, ...action.payload }
                : user
            )
          );
          break;

        case SyncEventType.SEND_MESSAGE:
          setChatMessages((prev) => {
            const exists = prev.some((m) => m.id === action.payload.id);
            if (exists) return prev;
            return [...prev, action.payload];
          });
          break;

        case SyncEventType.REMOVE_MESSAGE:
          if (action.payload.userId !== userId.current) {
            setChatMessages((prev) =>
              prev.filter((msg) => msg.id !== action.payload.messageId)
            );
          }
          break;

        case SyncEventType.UPDATE_COUNTER:
          setCounter({
            value: action.payload.value,
            lastUpdatedBy: action.payload.username,
            lastUpdatedAt: dayjs().valueOf(),
          });
          break;

        case SyncEventType.BEGIN_TYPING:
          if (action.payload.userId !== userId.current) {
            setTypingUsers((prev) => {
              if (prev.includes(action.payload.userId)) return prev;
              return [...prev, action.payload.userId];
            });
          }
          break;

        case SyncEventType.END_TYPING:
          setTypingUsers((prev) =>
            prev.filter((id) => id !== action.payload.userId)
          );
          break;

        case SyncEventType.REQUEST_SYNC:
          if (action.payload.requesterId !== userId.current) {
            setUsers((currentUsers) => {
              setChatMessages((currentMessages) => {
                setCounter((currentCounter) => {
                  setTypingUsers((currentTypingUsers) => {
                    const currentState: AppState = {
                      users: currentUsers,
                      messages: currentMessages,
                      counter: currentCounter,
                      typingUsers: currentTypingUsers,
                    };
                    postMessage(SyncEventType.SYNC_STATE, {
                      type: SyncEventType.SYNC_STATE,
                      payload: currentState,
                    });
                    return currentTypingUsers;
                  });
                  return currentCounter;
                });
                return currentMessages;
              });
              return currentUsers;
            });
          }
          break;

        case SyncEventType.SYNC_STATE:
          setUsers((prev) => {
            const merged = [...prev];
            action.payload.users.forEach((user: Participant) => {
              if (!merged.some((u) => u.id === user.id)) {
                merged.push(user);
              }
            });
            return merged;
          });

          if (chatMessages.length === 0) {
            setChatMessages([...action.payload.messages]);
            setCounter(action.payload.counter);
          }
          setTypingUsers(
            action.payload.typingUsers.filter(
              (id: string) => id !== userId.current
            )
          );
          break;
      }
    });

    clearReceivedMessages();
  }, [messages, postMessage, clearReceivedMessages, chatMessages.length]);

  return {
    users,
    messages: chatMessages,
    counter,
    typingUsers,
    currentUserId: userId.current,
    currentUsername: username.current,
    sendMessage,
    deleteMessage,
    updateCounter,
    markTyping,
  };
}
