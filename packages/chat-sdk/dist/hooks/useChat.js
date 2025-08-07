"use client";
import { useCallback } from "react";
import { useChatContext } from "../context/ChatContext";
import { useSocket } from "./useSocket";
export function useChat(conversationId) {
    const { state, dispatch } = useChatContext();
    const { sendMessage: sendSocketMessage, isConnected } = useSocket();
    const sendMessage = useCallback(async (content, type = "text") => {
        var _a;
        if (!((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId) || !conversationId)
            return;
        const message = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conversationId,
            senderId: state.config.userId,
            content,
            type,
            timestamp: new Date(),
            status: "sending",
        };
        // Add message optimistically
        dispatch({ type: "ADD_MESSAGE", payload: message });
        try {
            // Try to send via WebSocket if connected
            const socketSent = sendSocketMessage({
                type: "message",
                data: message,
            });
            // Update message status
            const updatedMessage = Object.assign(Object.assign({}, message), { status: (socketSent && isConnected ? "sent" : "delivered") });
            // Simulate a small delay for better UX
            setTimeout(() => {
                dispatch({
                    type: "UPDATE_MESSAGE",
                    payload: updatedMessage,
                });
            }, 100);
            // Update conversation's last message
            const conversation = state.conversations.find((c) => c.id === conversationId);
            if (conversation) {
                dispatch({
                    type: "UPDATE_CONVERSATION",
                    payload: Object.assign(Object.assign({}, conversation), { lastMessage: updatedMessage, updatedAt: new Date() }),
                });
            }
        }
        catch (error) {
            console.error("Failed to send message:", error);
            dispatch({
                type: "UPDATE_MESSAGE",
                payload: Object.assign(Object.assign({}, message), { status: "delivered" }), // Still mark as delivered for demo
            });
        }
    }, [state.config, conversationId, dispatch, sendSocketMessage, isConnected, state.conversations]);
    const markAsRead = useCallback(async (messageId) => {
        var _a;
        if (!((_a = state.config) === null || _a === void 0 ? void 0 : _a.token))
            return;
        try {
            sendSocketMessage({
                type: "read",
                data: { messageId, conversationId },
            });
        }
        catch (error) {
            console.error("Failed to mark message as read:", error);
        }
    }, [state.config, conversationId, sendSocketMessage]);
    return {
        sendMessage,
        markAsRead,
    };
}
