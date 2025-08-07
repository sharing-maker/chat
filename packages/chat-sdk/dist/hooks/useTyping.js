"use client";
import { useCallback, useEffect, useRef } from "react";
import { useChatContext } from "../context/ChatContext";
import { useSocket } from "./useSocket";
export function useTyping(conversationId) {
    var _a, _b;
    const { state } = useChatContext();
    const { sendMessage } = useSocket();
    const typingTimeoutRef = useRef();
    const startTyping = useCallback(() => {
        var _a;
        if (!((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId) || !conversationId)
            return;
        sendMessage({
            type: "typing",
            data: {
                userId: state.config.userId,
                conversationId,
                isTyping: true,
            },
        });
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 3000);
    }, [(_a = state.config) === null || _a === void 0 ? void 0 : _a.userId, conversationId, sendMessage]);
    const stopTyping = useCallback(() => {
        var _a;
        if (!((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId) || !conversationId)
            return;
        sendMessage({
            type: "typing",
            data: {
                userId: state.config.userId,
                conversationId,
                isTyping: false,
            },
        });
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    }, [(_b = state.config) === null || _b === void 0 ? void 0 : _b.userId, conversationId, sendMessage]);
    const typingUsers = state.typingStatuses
        .filter((t) => { var _a; return t.conversationId === conversationId && t.userId !== ((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId) && t.isTyping; })
        .map((t) => state.users[t.userId])
        .filter(Boolean);
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);
    return {
        startTyping,
        stopTyping,
        typingUsers,
        isTyping: typingUsers.length > 0,
    };
}
