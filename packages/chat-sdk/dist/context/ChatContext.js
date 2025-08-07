"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from "react";
const initialState = {
    config: null,
    conversations: [],
    messages: {},
    users: {},
    typingStatuses: [],
    currentUser: null,
    isConnected: false,
};
function chatReducer(state, action) {
    switch (action.type) {
        case "SET_CONFIG":
            return Object.assign(Object.assign({}, state), { config: action.payload });
        case "SET_CONVERSATIONS":
            return Object.assign(Object.assign({}, state), { conversations: action.payload });
        case "ADD_CONVERSATION":
            return Object.assign(Object.assign({}, state), { conversations: [action.payload, ...state.conversations] });
        case "UPDATE_CONVERSATION":
            return Object.assign(Object.assign({}, state), { conversations: state.conversations.map((conv) => (conv.id === action.payload.id ? action.payload : conv)) });
        case "SET_MESSAGES":
            return Object.assign(Object.assign({}, state), { messages: Object.assign(Object.assign({}, state.messages), { [action.payload.conversationId]: action.payload.messages }) });
        case "ADD_MESSAGE":
            const conversationId = action.payload.conversationId;
            return Object.assign(Object.assign({}, state), { messages: Object.assign(Object.assign({}, state.messages), { [conversationId]: [...(state.messages[conversationId] || []), action.payload] }) });
        case "UPDATE_MESSAGE":
            return Object.assign(Object.assign({}, state), { messages: Object.assign(Object.assign({}, state.messages), { [action.payload.conversationId]: (state.messages[action.payload.conversationId] || []).map((msg) => msg.id === action.payload.id ? action.payload : msg) }) });
        case "SET_USERS":
            return Object.assign(Object.assign({}, state), { users: action.payload });
        case "UPDATE_USER":
            return Object.assign(Object.assign({}, state), { users: Object.assign(Object.assign({}, state.users), { [action.payload.id]: action.payload }) });
        case "SET_TYPING":
            return Object.assign(Object.assign({}, state), { typingStatuses: [
                    ...state.typingStatuses.filter((t) => !(t.userId === action.payload.userId && t.conversationId === action.payload.conversationId)),
                    action.payload,
                ] });
        case "REMOVE_TYPING":
            return Object.assign(Object.assign({}, state), { typingStatuses: state.typingStatuses.filter((t) => !(t.userId === action.payload.userId && t.conversationId === action.payload.conversationId)) });
        case "SET_CONNECTION_STATUS":
            return Object.assign(Object.assign({}, state), { isConnected: action.payload });
        default:
            return state;
    }
}
const ChatContext = createContext(null);
export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
}
export function ChatProvider({ children, userId, token, onTokenRefresh, websocketUrl = "demo", // Use "demo" as default to disable WebSocket
enableWebSocket = false, // Disabled by default for demo
 }) {
    const [state, dispatch] = useReducer(chatReducer, initialState);
    // Initialize config
    useEffect(() => {
        const config = {
            userId,
            token,
            wsUrl: enableWebSocket ? websocketUrl : "demo",
            onTokenRefresh,
        };
        dispatch({ type: "SET_CONFIG", payload: config });
        // Initialize current user
        const currentUser = {
            id: userId,
            name: "You",
            status: "online",
        };
        dispatch({ type: "UPDATE_USER", payload: currentUser });
    }, [userId, token, websocketUrl, onTokenRefresh, enableWebSocket]);
    // Initialize with mock data for demo - MORE CONVERSATIONS
    useEffect(() => {
        if (!state.config)
            return;
        const mockUsers = {
            [userId]: {
                id: userId,
                name: "You",
                status: "online",
            },
            "user-2": {
                id: "user-2",
                name: "Alice Johnson",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            "user-3": {
                id: "user-3",
                name: "Bob Smith",
                status: "offline",
                avatar: "/placeholder.svg?height=40&width=40",
                lastSeen: new Date(Date.now() - 7200000),
            },
            "user-4": {
                id: "user-4",
                name: "Carol Davis",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            "user-5": {
                id: "user-5",
                name: "David Wilson",
                status: "away",
                avatar: "/placeholder.svg?height=40&width=40",
                lastSeen: new Date(Date.now() - 1800000),
            },
            "user-6": {
                id: "user-6",
                name: "Emma Brown",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            "user-7": {
                id: "user-7",
                name: "Frank Miller",
                status: "offline",
                avatar: "/placeholder.svg?height=40&width=40",
                lastSeen: new Date(Date.now() - 86400000),
            },
            "user-8": {
                id: "user-8",
                name: "Grace Lee",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            "user-9": {
                id: "user-9",
                name: "Henry Taylor",
                status: "away",
                avatar: "/placeholder.svg?height=40&width=40",
                lastSeen: new Date(Date.now() - 3600000),
            },
            "user-10": {
                id: "user-10",
                name: "Ivy Chen",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            "group-1": {
                id: "group-1",
                name: "Team Project",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            "group-2": {
                id: "group-2",
                name: "Family Chat",
                status: "online",
                avatar: "/placeholder.svg?height=40&width=40",
            },
        };
        const mockConversations = [
            {
                id: "conv-1",
                participants: [mockUsers["user-2"], mockUsers[userId]],
                unreadCount: 2,
                updatedAt: new Date(Date.now() - 300000), // 5 minutes ago
                type: "direct",
                lastMessage: {
                    id: "msg-1",
                    conversationId: "conv-1",
                    senderId: "user-2",
                    content: "Hey there! How are you doing? 😊",
                    type: "text",
                    timestamp: new Date(Date.now() - 300000),
                    status: "delivered",
                },
            },
            {
                id: "conv-2",
                participants: [mockUsers["user-3"], mockUsers[userId]],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 1800000), // 30 minutes ago
                type: "direct",
                lastMessage: {
                    id: "msg-2",
                    conversationId: "conv-2",
                    senderId: userId,
                    content: "Thanks for the help earlier!",
                    type: "text",
                    timestamp: new Date(Date.now() - 1800000),
                    status: "read",
                },
            },
            {
                id: "conv-3",
                participants: [mockUsers["user-4"], mockUsers[userId]],
                unreadCount: 1,
                updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
                type: "direct",
                lastMessage: {
                    id: "msg-3",
                    conversationId: "conv-3",
                    senderId: "user-4",
                    content: "Can you review this document?",
                    type: "file",
                    timestamp: new Date(Date.now() - 3600000),
                    status: "delivered",
                },
            },
            {
                id: "conv-4",
                participants: [mockUsers["user-5"], mockUsers[userId]],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
                type: "direct",
                lastMessage: {
                    id: "msg-4",
                    conversationId: "conv-4",
                    senderId: userId,
                    content: "See you tomorrow!",
                    type: "text",
                    timestamp: new Date(Date.now() - 7200000),
                    status: "read",
                },
            },
            {
                id: "conv-5",
                participants: [mockUsers["user-6"], mockUsers[userId]],
                unreadCount: 3,
                updatedAt: new Date(Date.now() - 10800000), // 3 hours ago
                type: "direct",
                lastMessage: {
                    id: "msg-5",
                    conversationId: "conv-5",
                    senderId: "user-6",
                    content: "Check out these photos from the event!",
                    type: "image",
                    timestamp: new Date(Date.now() - 10800000),
                    status: "delivered",
                },
            },
            {
                id: "conv-6",
                participants: [mockUsers["user-7"], mockUsers[userId]],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 86400000), // 1 day ago
                type: "direct",
                lastMessage: {
                    id: "msg-6",
                    conversationId: "conv-6",
                    senderId: "user-7",
                    content: "Happy birthday! 🎉",
                    type: "text",
                    timestamp: new Date(Date.now() - 86400000),
                    status: "read",
                },
            },
            {
                id: "conv-7",
                participants: [mockUsers["user-8"], mockUsers[userId]],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 172800000), // 2 days ago
                type: "direct",
                lastMessage: {
                    id: "msg-7",
                    conversationId: "conv-7",
                    senderId: userId,
                    content: "Thanks for the coffee recommendation!",
                    type: "text",
                    timestamp: new Date(Date.now() - 172800000),
                    status: "read",
                },
            },
            {
                id: "conv-8",
                participants: [mockUsers["user-9"], mockUsers[userId]],
                unreadCount: 1,
                updatedAt: new Date(Date.now() - 259200000), // 3 days ago
                type: "direct",
                lastMessage: {
                    id: "msg-8",
                    conversationId: "conv-8",
                    senderId: "user-9",
                    content: "Let's schedule a meeting next week",
                    type: "text",
                    timestamp: new Date(Date.now() - 259200000),
                    status: "delivered",
                },
            },
            {
                id: "conv-9",
                participants: [mockUsers["user-10"], mockUsers[userId]],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 345600000), // 4 days ago
                type: "direct",
                lastMessage: {
                    id: "msg-9",
                    conversationId: "conv-9",
                    senderId: userId,
                    content: "Great presentation today!",
                    type: "text",
                    timestamp: new Date(Date.now() - 345600000),
                    status: "read",
                },
            },
            {
                id: "group-conv-1",
                participants: [mockUsers["group-1"], mockUsers[userId], mockUsers["user-2"], mockUsers["user-4"]],
                unreadCount: 5,
                updatedAt: new Date(Date.now() - 600000), // 10 minutes ago
                type: "group",
                name: "Team Project",
                avatar: "/placeholder.svg?height=40&width=40",
                lastMessage: {
                    id: "msg-group-1",
                    conversationId: "group-conv-1",
                    senderId: "user-4",
                    content: "The deadline has been moved to Friday",
                    type: "text",
                    timestamp: new Date(Date.now() - 600000),
                    status: "delivered",
                },
            },
            {
                id: "group-conv-2",
                participants: [mockUsers["group-2"], mockUsers[userId], mockUsers["user-6"], mockUsers["user-8"]],
                unreadCount: 0,
                updatedAt: new Date(Date.now() - 432000000), // 5 days ago
                type: "group",
                name: "Family Chat",
                avatar: "/placeholder.svg?height=40&width=40",
                lastMessage: {
                    id: "msg-group-2",
                    conversationId: "group-conv-2",
                    senderId: "user-6",
                    content: "Looking forward to the reunion!",
                    type: "text",
                    timestamp: new Date(Date.now() - 432000000),
                    status: "read",
                },
            },
        ];
        dispatch({ type: "SET_USERS", payload: mockUsers });
        dispatch({ type: "SET_CONVERSATIONS", payload: mockConversations });
    }, [state.config, userId]);
    const value = {
        state,
        dispatch,
    };
    return _jsx(ChatContext.Provider, { value: value, children: children });
}
