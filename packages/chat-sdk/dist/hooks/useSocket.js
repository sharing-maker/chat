"use client";
import { useEffect, useRef, useCallback } from "react";
import { useChatContext } from "../context/ChatContext";
export function useSocket() {
    const { state, dispatch } = useChatContext();
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef();
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 3;
    const connect = useCallback(() => {
        var _a;
        // Skip WebSocket connection in demo mode or if no URL provided
        if (!((_a = state.config) === null || _a === void 0 ? void 0 : _a.wsUrl) || state.config.wsUrl.includes("localhost") || state.config.wsUrl === "demo") {
            console.log("WebSocket disabled for demo mode");
            dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
            return;
        }
        if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.log("Max reconnection attempts reached");
            return;
        }
        try {
            const ws = new WebSocket(`${state.config.wsUrl}?token=${state.config.token}`);
            ws.onopen = () => {
                console.log("WebSocket connected");
                dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
                socketRef.current = ws;
                reconnectAttempts.current = 0;
            };
            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    handleSocketMessage(message);
                }
                catch (error) {
                    console.error("Failed to parse socket message:", error);
                }
            };
            ws.onclose = (event) => {
                console.log("WebSocket disconnected", event.code, event.reason);
                dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
                socketRef.current = null;
                // Only attempt to reconnect if it wasn't a manual close
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log(`Reconnection attempt ${reconnectAttempts.current}`);
                        connect();
                    }, 3000 * reconnectAttempts.current); // Exponential backoff
                }
            };
            ws.onerror = (error) => {
                console.warn("WebSocket connection failed - running in offline mode");
                dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
                // Don't attempt to reconnect on error to avoid spam
                reconnectAttempts.current = maxReconnectAttempts;
            };
        }
        catch (error) {
            console.warn("Failed to create WebSocket connection - running in offline mode");
            dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
        }
    }, [state.config]);
    const handleSocketMessage = useCallback((message) => {
        switch (message.type) {
            case "message":
                dispatch({ type: "ADD_MESSAGE", payload: message.data });
                break;
            case "typing":
                if (message.data.isTyping) {
                    dispatch({ type: "SET_TYPING", payload: message.data });
                }
                else {
                    dispatch({
                        type: "REMOVE_TYPING",
                        payload: {
                            userId: message.data.userId,
                            conversationId: message.data.conversationId,
                        },
                    });
                }
                break;
            case "read":
                dispatch({ type: "UPDATE_MESSAGE", payload: message.data });
                break;
            case "user_status":
                dispatch({ type: "UPDATE_USER", payload: message.data });
                break;
        }
    }, [dispatch]);
    const sendMessage = useCallback((message) => {
        var _a;
        if (((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
            return true;
        }
        console.log("WebSocket not connected - message not sent:", message);
        return false;
    }, []);
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (socketRef.current) {
            socketRef.current.close(1000, "Manual disconnect");
            socketRef.current = null;
        }
        reconnectAttempts.current = maxReconnectAttempts;
    }, []);
    useEffect(() => {
        connect();
        return disconnect;
    }, [connect, disconnect]);
    return {
        isConnected: state.isConnected,
        sendMessage,
        disconnect,
        reconnect: connect,
    };
}
