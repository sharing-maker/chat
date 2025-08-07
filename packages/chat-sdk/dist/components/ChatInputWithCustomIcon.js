"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback } from "react";
import { Smile, ImageIcon, Paperclip, Mic, ThumbsUp, Send, Type, Sticker, User } from "lucide-react";
import { VoiceWaveIcon } from "./VoiceWaveIcon";
export function ChatInputWithCustomIcon({ onSendMessage, onEmojiClick, onFileUpload, onImageUpload, onContactShare, onVoiceRecord, onVoiceMessage, onQuickReact, placeholder = "Nhập tin nhắn", disabled = false, className = "", }) {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [showVoiceWave, setShowVoiceWave] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!message.trim() || disabled)
            return;
        onSendMessage === null || onSendMessage === void 0 ? void 0 : onSendMessage(message.trim());
        setMessage("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, [message, disabled, onSendMessage]);
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setMessage(value);
        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }, []);
    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);
    const handleFileClick = useCallback(() => {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    }, []);
    const handleImageClick = useCallback(() => {
        var _a;
        (_a = imageInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    }, []);
    const handleFileChange = useCallback((e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            onFileUpload === null || onFileUpload === void 0 ? void 0 : onFileUpload(file);
            e.target.value = ""; // Reset input
        }
    }, [onFileUpload]);
    const handleImageChange = useCallback((e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            onImageUpload === null || onImageUpload === void 0 ? void 0 : onImageUpload(file);
            e.target.value = ""; // Reset input
        }
    }, [onImageUpload]);
    const handleVoiceRecord = useCallback(() => {
        setIsRecording(!isRecording);
        onVoiceRecord === null || onVoiceRecord === void 0 ? void 0 : onVoiceRecord();
    }, [isRecording, onVoiceRecord]);
    const handleVoiceMessage = useCallback(() => {
        setShowVoiceWave(!showVoiceWave);
        onVoiceMessage === null || onVoiceMessage === void 0 ? void 0 : onVoiceMessage();
    }, [showVoiceWave, onVoiceMessage]);
    return (_jsxs("div", { className: `bg-white border-t border-gray-200 p-3 sm:p-4 ${className}`, children: [_jsxs("div", { className: "bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200", children: [_jsx("div", { className: "px-4 py-3", children: _jsxs("form", { onSubmit: handleSubmit, className: "flex items-end space-x-3", children: [_jsx("div", { className: "flex-1 relative", children: _jsx("textarea", { ref: textareaRef, value: message, onChange: handleInputChange, onKeyPress: handleKeyPress, placeholder: placeholder, disabled: disabled, className: "w-full bg-transparent border-none outline-none resize-none text-sm sm:text-base text-gray-900 placeholder-gray-500 leading-5", rows: 1, style: {
                                            minHeight: "20px",
                                            maxHeight: "120px",
                                        } }) }), message.trim() ? (_jsx("button", { type: "submit", disabled: disabled, className: "flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200", "aria-label": "Send message", children: _jsx(Send, { className: "w-4 h-4" }) })) : (_jsx("button", { type: "button", onClick: onQuickReact, className: "flex-shrink-0 p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200", "aria-label": "Quick react", children: _jsx(ThumbsUp, { className: "w-4 h-4" }) }))] }) }), _jsx("div", { className: "px-4 pb-3 border-t border-gray-100", children: _jsxs("div", { className: "flex items-center justify-between space-x-1", children: [_jsx("button", { onClick: () => console.log("Text style clicked"), disabled: disabled, className: "p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-blue-500", "aria-label": "Text style", title: "Text style", children: _jsx(Type, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: () => onEmojiClick === null || onEmojiClick === void 0 ? void 0 : onEmojiClick("😊"), disabled: disabled, className: "p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-yellow-500", "aria-label": "Emoji", title: "Emoji", children: _jsx(Smile, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: () => console.log("Sticker clicked"), disabled: disabled, className: "p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-purple-500", "aria-label": "Sticker", title: "Sticker", children: _jsx(Sticker, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: handleImageClick, disabled: disabled, className: "p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-green-500", "aria-label": "Image upload", title: "Image upload", children: _jsx(ImageIcon, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: handleFileClick, disabled: disabled, className: "p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-blue-500", "aria-label": "File attachment", title: "File attachment", children: _jsx(Paperclip, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: onContactShare, disabled: disabled, className: "p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-indigo-500", "aria-label": "Contact sharing", title: "Contact sharing", children: _jsx(User, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: handleVoiceRecord, disabled: disabled, className: `
                p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100 active:scale-95
                ${isRecording ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500"}
              `, "aria-label": "Record audio", title: "Record audio", children: _jsx(Mic, { className: "w-4 h-4 sm:w-5 sm:h-5" }) }), _jsx("button", { onClick: handleVoiceMessage, disabled: disabled, className: `
                p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100 active:scale-95
                ${showVoiceWave ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:text-blue-500"}
              `, "aria-label": "Voice message", title: "Voice message", children: _jsx(VoiceWaveIcon, { className: "w-4 h-4 sm:w-5 sm:h-5", animated: showVoiceWave }) })] }) }), isRecording && (_jsx("div", { className: "px-4 pb-2", children: _jsxs("div", { className: "flex items-center space-x-2 text-red-500 text-sm", children: [_jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }), _jsx("span", { children: "Recording..." })] }) })), showVoiceWave && (_jsx("div", { className: "px-4 pb-2", children: _jsx("div", { className: "flex items-center space-x-1", children: [...Array(8)].map((_, i) => (_jsx("div", { className: "w-1 bg-blue-500 rounded-full animate-pulse", style: {
                                    height: `${Math.random() * 20 + 10}px`,
                                    animationDelay: `${i * 0.1}s`,
                                } }, i))) }) }))] }), _jsx("input", { ref: fileInputRef, type: "file", onChange: handleFileChange, className: "hidden", accept: ".pdf,.doc,.docx,.txt,.zip,.rar" }), _jsx("input", { ref: imageInputRef, type: "file", onChange: handleImageChange, className: "hidden", accept: "image/*" })] }));
}
