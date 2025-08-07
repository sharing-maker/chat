"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef } from "react";
import { Smile, ImageIcon, Paperclip, Mic, Send, Type, Sticker, User, X, Loader2, FileText } from "lucide-react"; // Import FileText icon
import { useChat } from "../hooks/useChat";
import { useTyping } from "../hooks/useTyping";
import { useTextSelection } from "../hooks/useTextSelection";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import { EmojiPicker } from "./EmojiPicker";
import { StickerPicker } from "./StickerPicker";
export function ChatInput({ conversationId, onSendMessage, onEmojiClick, onStickerClick, onFileUpload, onImageUpload, onContactShare, onVoiceRecord, onVoiceMessage, onQuickReact, placeholder = "Nhập tin nhắn", disabled = false, className = "", }) {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [showVoiceWave, setShowVoiceWave] = useState(false);
    const [showTextToolbar, setShowTextToolbar] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]); // State for selected files
    const [isUploading, setIsUploading] = useState(false); // State for uploading status
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    // Refs for popups
    const textToolbarRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const stickerPickerRef = useRef(null);
    // Refs for toggle buttons
    const textButtonRef = useRef(null);
    const emojiButtonRef = useRef(null);
    const stickerButtonRef = useRef(null);
    // Ref for the relative container that wraps the popups
    const popupWrapperRef = useRef(null);
    // State for dynamic popup styles
    const [textToolbarStyle, setTextToolbarStyle] = useState({});
    const [emojiPickerStyle, setEmojiPickerStyle] = useState({});
    const [stickerPickerStyle, setStickerPickerStyle] = useState({});
    const { sendMessage: sendChatMessage } = useChat(conversationId || "");
    const { startTyping, stopTyping } = useTyping(conversationId || "");
    const { textareaRef, applyFormat } = useTextSelection();
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (disabled || isUploading)
            return;
        if (selectedFiles.length > 0) {
            setIsUploading(true);
            // Simulate file upload
            await Promise.all(selectedFiles.map(async (file) => {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
                if (file.type.startsWith("image/")) {
                    onImageUpload === null || onImageUpload === void 0 ? void 0 : onImageUpload(file);
                }
                else {
                    onFileUpload === null || onFileUpload === void 0 ? void 0 : onFileUpload(file);
                }
            }));
            setSelectedFiles([]);
            setIsUploading(false);
        }
        if (message.trim()) {
            // Use integrated chat system if available, otherwise use callback
            if (sendChatMessage) {
                sendChatMessage(message.trim());
            }
            else {
                onSendMessage === null || onSendMessage === void 0 ? void 0 : onSendMessage(message.trim());
            }
            setMessage("");
            setSelectedFormats([]);
            stopTyping();
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    }, [
        message,
        disabled,
        isUploading,
        selectedFiles,
        sendChatMessage,
        onSendMessage,
        onFileUpload,
        onImageUpload,
        stopTyping,
        textareaRef,
    ]);
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setMessage(value);
        // Trigger typing indicator
        if (value.trim()) {
            startTyping();
        }
        else {
            stopTyping();
        }
        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }, [startTyping, stopTyping]);
    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case "b":
                    e.preventDefault();
                    applyFormat("bold");
                    break;
                case "i":
                    e.preventDefault();
                    applyFormat("italic");
                    break;
                case "e":
                    e.preventDefault();
                    applyFormat("code");
                    break;
                case "k":
                    e.preventDefault();
                    applyFormat("link");
                    break;
            }
        }
    }, [handleSubmit, applyFormat]);
    const handleFileClick = useCallback(() => {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    }, []);
    const handleImageClick = useCallback(() => {
        var _a;
        (_a = imageInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    }, []);
    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            e.target.value = ""; // Reset input to allow selecting same file again
        }
    }, []);
    const handleImageChange = useCallback((e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            e.target.value = ""; // Reset input to allow selecting same file again
        }
    }, []);
    const handleRemoveFile = useCallback((fileToRemove) => {
        setSelectedFiles((prev) => prev.filter((file) => file !== fileToRemove));
    }, []);
    const handleVoiceRecord = useCallback(() => {
        setIsRecording(!isRecording);
        onVoiceRecord === null || onVoiceRecord === void 0 ? void 0 : onVoiceRecord();
    }, [isRecording, onVoiceRecord]);
    const handleTextToolbarToggle = useCallback(() => {
        setShowTextToolbar((prev) => !prev);
        setShowEmojiPicker(false);
        setShowStickerPicker(false);
    }, []);
    const handleEmojiToggle = useCallback(() => {
        setShowEmojiPicker((prev) => !prev);
        setShowTextToolbar(false);
        setShowStickerPicker(false);
    }, []);
    const handleStickerToggle = useCallback(() => {
        setShowStickerPicker((prev) => !prev);
        setShowTextToolbar(false);
        setShowEmojiPicker(false);
    }, []);
    const handleFormatSelect = useCallback((format) => {
        applyFormat(format);
        setSelectedFormats((prev) => {
            if (prev.includes(format)) {
                return prev.filter((f) => f !== format);
            }
            else {
                return [...prev, format];
            }
        });
    }, [applyFormat]);
    const handleEmojiSelect = useCallback((emoji) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newMessage = message.slice(0, start) + emoji + message.slice(end);
            setMessage(newMessage);
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
                textarea.focus();
            }, 0);
        }
        onEmojiClick === null || onEmojiClick === void 0 ? void 0 : onEmojiClick(emoji);
    }, [message, onEmojiClick, textareaRef]);
    const handleStickerSelect = useCallback((sticker) => {
        // Send sticker immediately (like a message)
        if (sendChatMessage) {
            sendChatMessage(sticker);
        }
        else {
            onSendMessage === null || onSendMessage === void 0 ? void 0 : onSendMessage(sticker);
        }
        onStickerClick === null || onStickerClick === void 0 ? void 0 : onStickerClick(sticker);
        setShowStickerPicker(false); // Close picker after selection
    }, [sendChatMessage, onSendMessage, onStickerClick]);
    // Click outside logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            // Text Formatting Toolbar
            if (showTextToolbar &&
                textToolbarRef.current &&
                !textToolbarRef.current.contains(target) &&
                textButtonRef.current &&
                !textButtonRef.current.contains(target)) {
                setShowTextToolbar(false);
            }
            // Emoji Picker
            if (showEmojiPicker &&
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(target)) {
                setShowEmojiPicker(false);
            }
            // Sticker Picker
            if (showStickerPicker &&
                stickerPickerRef.current &&
                !stickerPickerRef.current.contains(target) &&
                stickerButtonRef.current &&
                !stickerButtonRef.current.contains(target)) {
                setShowStickerPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTextToolbar, showEmojiPicker, showStickerPicker]);
    // Dynamic positioning logic for popups
    const calculatePopupPosition = useCallback((buttonRef, popupRef, setPopupStyle) => {
        const wrapper = popupWrapperRef.current;
        const button = buttonRef.current;
        const popup = popupRef.current;
        if (!wrapper || !button || !popup)
            return;
        const wrapperRect = wrapper.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        let desiredLeft = buttonRect.left - wrapperRect.left;
        // Add a small margin (e.g., 8px) from the right edge of the viewport
        const rightViewportMargin = 8;
        if (wrapperRect.left + desiredLeft + popupRect.width > viewportWidth - rightViewportMargin) {
            desiredLeft = viewportWidth - wrapperRect.left - popupRect.width - rightViewportMargin;
            // Ensure it doesn't go off the left edge (e.g., 8px margin from left)
            desiredLeft = Math.max(8, desiredLeft);
        }
        setPopupStyle({ left: `${desiredLeft}px` });
    }, []);
    useEffect(() => {
        if (showTextToolbar) {
            calculatePopupPosition(textButtonRef, textToolbarRef, setTextToolbarStyle);
            window.addEventListener("resize", () => calculatePopupPosition(textButtonRef, textToolbarRef, setTextToolbarStyle));
        }
        else {
            setTextToolbarStyle({}); // Reset style when closed
        }
        return () => window.removeEventListener("resize", () => calculatePopupPosition(textButtonRef, textToolbarRef, setTextToolbarStyle));
    }, [showTextToolbar, calculatePopupPosition]);
    useEffect(() => {
        if (showEmojiPicker) {
            calculatePopupPosition(emojiButtonRef, emojiPickerRef, setEmojiPickerStyle);
            window.addEventListener("resize", () => calculatePopupPosition(emojiButtonRef, emojiPickerRef, setEmojiPickerStyle));
        }
        else {
            setEmojiPickerStyle({}); // Reset style when closed
        }
        return () => window.removeEventListener("resize", () => calculatePopupPosition(emojiButtonRef, emojiPickerRef, setEmojiPickerStyle));
    }, [showEmojiPicker, calculatePopupPosition]);
    useEffect(() => {
        if (showStickerPicker) {
            calculatePopupPosition(stickerButtonRef, stickerPickerRef, setStickerPickerStyle);
            window.addEventListener("resize", () => calculatePopupPosition(stickerButtonRef, stickerPickerRef, setStickerPickerStyle));
        }
        else {
            setStickerPickerStyle({}); // Reset style when closed
        }
        return () => window.removeEventListener("resize", () => calculatePopupPosition(stickerButtonRef, stickerPickerRef, setStickerPickerStyle));
    }, [showStickerPicker, calculatePopupPosition]);
    // Cleanup object URLs when selectedFiles change or component unmounts
    useEffect(() => {
        const objectUrls = [];
        selectedFiles.forEach((file) => {
            if (file.type.startsWith("image/")) {
                objectUrls.push(URL.createObjectURL(file));
            }
        });
        return () => {
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [selectedFiles]);
    // Small, left-aligned action buttons
    const actionButtons = [
        {
            icon: Type,
            label: "Định dạng văn bản",
            onClick: handleTextToolbarToggle,
            color: showTextToolbar ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:text-blue-500",
            active: showTextToolbar,
            ref: textButtonRef,
        },
        {
            icon: Smile,
            label: "Emoji",
            onClick: handleEmojiToggle,
            color: showEmojiPicker ? "text-yellow-500 bg-yellow-50" : "text-gray-500 hover:text-yellow-500",
            active: showEmojiPicker,
            ref: emojiButtonRef,
        },
        {
            icon: Sticker,
            label: "Sticker",
            onClick: handleStickerToggle,
            color: showStickerPicker ? "text-purple-500 bg-purple-50" : "text-gray-500 hover:text-purple-500",
            active: showStickerPicker,
            ref: stickerButtonRef,
        },
        {
            icon: ImageIcon,
            label: "Hình ảnh",
            onClick: handleImageClick,
            color: "text-gray-500 hover:text-green-500",
        },
        {
            icon: Paperclip,
            label: "Tệp đính kèm",
            onClick: handleFileClick,
            color: "text-gray-500 hover:text-blue-500",
        },
        {
            icon: User,
            label: "Chia sẻ liên hệ",
            onClick: onContactShare,
            color: "text-gray-500 hover:text-indigo-500",
        },
        {
            icon: Mic,
            label: "Ghi âm",
            onClick: handleVoiceRecord,
            color: isRecording ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500",
            active: isRecording,
        },
    ];
    const isSendButtonDisabled = disabled || isUploading || (message.trim() === "" && selectedFiles.length === 0);
    return (_jsxs("div", { className: `bg-white border-t border-gray-200 p-3 sm:p-4 ${className}`, children: [_jsxs("div", { className: "relative", ref: popupWrapperRef, children: [_jsx(TextFormattingToolbar, { ref: textToolbarRef, isOpen: showTextToolbar, onClose: () => setShowTextToolbar(false), onFormatSelect: handleFormatSelect, selectedFormats: selectedFormats, style: textToolbarStyle }), _jsx(EmojiPicker, { ref: emojiPickerRef, isOpen: showEmojiPicker, onEmojiSelect: handleEmojiSelect, onClose: () => setShowEmojiPicker(false), style: emojiPickerStyle }), _jsx(StickerPicker, { ref: stickerPickerRef, isOpen: showStickerPicker, onStickerSelect: handleStickerSelect, onClose: () => setShowStickerPicker(false), style: stickerPickerStyle })] }), _jsxs("div", { className: "bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200", children: [selectedFiles.length > 0 && (_jsx("div", { className: "px-4 pt-3 pb-2 border-b border-gray-100 flex flex-wrap gap-2", children: selectedFiles.map((file, index) => {
                            const isImage = file.type.startsWith("image/");
                            const fileUrl = isImage ? URL.createObjectURL(file) : null;
                            return (_jsxs("div", { className: "flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-lg relative overflow-hidden", children: [isImage ? (_jsx("img", { src: fileUrl || "", alt: file.name, className: "h-12 w-12 object-cover rounded-md mr-2" })) : (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(FileText, { className: "w-4 h-4 text-blue-600" }), " ", _jsx("span", { className: "truncate max-w-[100px] sm:max-w-[150px]", children: file.name })] })), _jsx("button", { type: "button", onClick: () => handleRemoveFile(file), className: "ml-1 p-0.5 rounded-full hover:bg-blue-200 text-blue-600 absolute top-0.5 right-0.5 bg-white/70 backdrop-blur-sm", "aria-label": `Remove ${file.name}`, children: _jsx(X, { className: "w-3 h-3" }) })] }, index));
                        }) })), _jsx("div", { className: "px-4 py-3", children: _jsxs("form", { onSubmit: handleSubmit, className: "flex items-end space-x-3", children: [_jsx("div", { className: "flex-1 relative", children: _jsx("textarea", { ref: textareaRef, value: message, onChange: handleInputChange, onKeyDown: handleKeyPress, placeholder: placeholder, disabled: disabled || isUploading, className: "w-full bg-transparent border-none outline-none resize-none text-sm sm:text-base text-gray-900 placeholder-gray-500 leading-5", rows: 1, style: {
                                            minHeight: "20px",
                                            maxHeight: "120px",
                                        } }) }), _jsx("button", { type: "submit", disabled: isSendButtonDisabled, className: "flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200", "aria-label": isUploading ? "Đang tải lên" : "Gửi tin nhắn", children: isUploading ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(Send, { className: "w-4 h-4" }) })] }) }), _jsx("div", { className: "px-4 pb-3 border-t border-gray-100", children: _jsx("div", { className: "flex items-center space-x-2 justify-start", children: actionButtons.map((button, index) => {
                                const Icon = button.icon;
                                return (_jsx("button", { ref: button.ref, onClick: button.onClick, disabled: disabled || isUploading, className: `
                    p-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-gray-100 active:scale-95
                    ${button.color}
                  `, "aria-label": button.label, title: button.label, children: _jsx(Icon, { className: "w-4 h-4" }) }, index));
                            }) }) }), isRecording && (_jsx("div", { className: "px-4 pb-2", children: _jsxs("div", { className: "flex items-center space-x-2 text-red-500 text-sm", children: [_jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }), _jsx("span", { children: "\u0110ang ghi \u00E2m..." })] }) })), showVoiceWave && (_jsx("div", { className: "px-4 pb-2", children: _jsx("div", { className: "flex items-center space-x-1", children: [...Array(8)].map((_, i) => (_jsx("div", { className: "w-1 bg-blue-500 rounded-full animate-pulse", style: {
                                    height: `${Math.random() * 20 + 10}px`,
                                    animationDelay: `${i * 0.1}s`,
                                } }, i))) }) }))] }), _jsx("input", { ref: fileInputRef, type: "file", onChange: handleFileChange, className: "hidden", accept: ".pdf,.doc,.docx,.txt,.zip,.rar", multiple // Allow multiple file selection
                : true }), _jsx("input", { ref: imageInputRef, type: "file", onChange: handleImageChange, className: "hidden", accept: "image/*", multiple // Allow multiple image selection
                : true })] }));
}
