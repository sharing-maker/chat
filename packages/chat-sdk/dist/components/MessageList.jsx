"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { MessageItem } from "./MessageItem";
import { DateDivider } from "./DateDivider";
import { TypingIndicator } from "./TypingIndicator";
// import { AutoScrollAnchor } from "./AutoScrollAnchor" // Removed
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useChatContext } from "../context/ChatContext";
import { ImagePreviewModal } from "./ImagePreviewModal"; // Import the new modal
export function MessageList({ messages = [], // Add default empty array
isLoadingMore = false, onLoadMore, hasMore = false, currentUserId, conversationId, className = "", onSwipeBack, }) {
    const { state } = useChatContext();
    const scrollRef = useRef(null);
    const shouldScrollToBottomRef = useRef(true); // New ref to control auto-scrolling
    const lastMessageCountRef = useRef((messages === null || messages === void 0 ? void 0 : messages.length) || 0); // Add null check
    const [showSwipeHint, setShowSwipeHint] = useState(false);
    const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false); // State for button visibility
    // State for ImagePreviewModal
    const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [initialPreviewImageId, setInitialPreviewImageId] = useState("");
    // Convert internal Message format to DisplayMessage format
    const convertToDisplayMessages = useCallback(() => {
        if (!messages || !Array.isArray(messages))
            return []; // Add safety check
        return messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUserId;
            // Handle different message types
            if (msg.attachments && msg.attachments.length > 0) {
                return {
                    id: msg.id,
                    senderId: msg.senderId,
                    type: "media",
                    text: msg.content || undefined,
                    attachments: msg.attachments.map((att) => ({
                        id: att.id, // Ensure ID is passed
                        type: att.type.startsWith("image/") ? "image" : "file",
                        url: att.url,
                        name: att.name,
                        size: att.size,
                    })),
                    createdAt: msg.timestamp.toISOString(),
                    isMine: isCurrentUser,
                };
            }
            // Promotional message type (assuming senderId 'system' or similar for demo)
            if (msg.type === "promo" && msg.promoData) {
                return {
                    id: msg.id,
                    senderId: msg.senderId,
                    type: "promo",
                    promoData: msg.promoData,
                    createdAt: msg.timestamp.toISOString(),
                    isMine: isCurrentUser, // Can be false for system messages
                };
            }
            // Regular text message
            return {
                id: msg.id,
                senderId: msg.senderId,
                type: "text",
                text: msg.content,
                createdAt: msg.timestamp.toISOString(),
                isMine: isCurrentUser,
            };
        });
    }, [messages, currentUserId]);
    const displayMessages = convertToDisplayMessages();
    // Swipe gesture for going back (secondary swipe area)
    const messageSwipeRef = useSwipeGesture({
        onSwipeRight: () => {
            if (window.innerWidth < 768) {
                setShowSwipeHint(true);
                setTimeout(() => setShowSwipeHint(false), 1500);
                onSwipeBack === null || onSwipeBack === void 0 ? void 0 : onSwipeBack();
            }
        },
        threshold: 80,
        restraint: 120,
        allowedTime: 400,
        enabled: true,
    });
    // Auto-scroll to bottom logic
    const scrollToBottom = useCallback((force = false) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            if (force) {
                shouldScrollToBottomRef.current = true; // If forced, ensure auto-scroll is re-enabled
            }
        }
    }, []);
    // Handle scroll events to manage auto-scroll behavior and button visibility
    const handleScroll = useCallback(() => {
        if (!scrollRef.current)
            return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const SCROLL_UP_THRESHOLD = 200; // If user scrolls up more than 200px from bottom, disable auto-scroll
        const SCROLL_DOWN_THRESHOLD = 5; // If user scrolls within 5px of bottom, re-enable auto-scroll
        if (distanceFromBottom > SCROLL_UP_THRESHOLD) {
            shouldScrollToBottomRef.current = false;
        }
        else if (distanceFromBottom <= SCROLL_DOWN_THRESHOLD) {
            shouldScrollToBottomRef.current = true;
        }
        // Show button if not at bottom AND auto-scroll is disabled
        setShowScrollToBottomButton(distanceFromBottom > SCROLL_DOWN_THRESHOLD && !shouldScrollToBottomRef.current);
    }, []);
    // Handle new messages
    useEffect(() => {
        const currentMessageCount = (messages === null || messages === void 0 ? void 0 : messages.length) || 0;
        const previousMessageCount = lastMessageCountRef.current;
        if (currentMessageCount > previousMessageCount) {
            const newMessages = messages.slice(previousMessageCount);
            const hasNewMessageFromCurrentUser = newMessages.some((msg) => msg.senderId === currentUserId);
            // If current user sent a message, always scroll to bottom
            // If another user sent a message, only scroll if shouldScrollToBottomRef is true (user is already at bottom)
            if (hasNewMessageFromCurrentUser) {
                setTimeout(() => scrollToBottom(true), 50); // Force scroll for own messages
            }
            else if (shouldScrollToBottomRef.current) {
                setTimeout(() => scrollToBottom(), 50); // Scroll if auto-scroll is enabled for others' messages
            }
        }
        lastMessageCountRef.current = currentMessageCount;
    }, [messages, currentUserId, scrollToBottom]); // scrollToBottom is a dependency because it's called here
    // Attach and detach scroll listener
    useEffect(() => {
        const currentScrollRef = scrollRef.current;
        if (currentScrollRef) {
            currentScrollRef.addEventListener("scroll", handleScroll);
            // Initial check for button visibility
            handleScroll();
        }
        return () => {
            if (currentScrollRef) {
                currentScrollRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]); // Re-attach if handleScroll changes (due to useCallback dependencies)
    // Preserve scroll position when loading more messages
    useEffect(() => {
        if (isLoadingMore)
            return;
        const scrollContainer = scrollRef.current;
        if (!scrollContainer)
            return;
        // Save current scroll position
        const previousScrollHeight = scrollContainer.scrollHeight;
        const previousScrollTop = scrollContainer.scrollTop;
        // After new messages are loaded, adjust scroll position
        const adjustScrollPosition = () => {
            const newScrollHeight = scrollContainer.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeight;
            if (heightDifference > 0) {
                scrollContainer.scrollTop = previousScrollTop + heightDifference;
            }
        };
        // Use setTimeout to ensure DOM has updated
        setTimeout(adjustScrollPosition, 0);
    }, [isLoadingMore]);
    // Show swipe hint on first load for mobile users
    useEffect(() => {
        const hasSeenHint = localStorage.getItem("chat-swipe-hint-seen");
        if (!hasSeenHint && window.innerWidth < 768) {
            setTimeout(() => {
                setShowSwipeHint(true);
                setTimeout(() => {
                    setShowSwipeHint(false);
                    localStorage.setItem("chat-swipe-hint-seen", "true");
                }, 3000);
            }, 1000);
        }
    }, []);
    // Group messages by date
    const groupMessagesByDate = useCallback(() => {
        const groups = [];
        let currentDate = "";
        let currentGroup = [];
        displayMessages.forEach((message) => {
            const messageDate = new Date(message.createdAt).toDateString();
            if (messageDate !== currentDate) {
                if (currentGroup.length > 0) {
                    groups.push({ date: currentDate, messages: currentGroup });
                }
                currentDate = messageDate;
                currentGroup = [message];
            }
            else {
                currentGroup.push(message);
            }
        });
        if (currentGroup.length > 0) {
            groups.push({ date: currentDate, messages: currentGroup });
        }
        return groups;
    }, [displayMessages]);
    const messageGroups = groupMessagesByDate();
    // Format date labels in Vietnamese
    const formatDateLabel = (date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (messageDate.getTime() === today.getTime()) {
            return "Hôm nay";
        }
        else if (messageDate.getTime() === yesterday.getTime()) {
            return "Hôm qua";
        }
        else {
            return date.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    };
    // Handler for image clicks from MessageItem
    const handleImageClick = useCallback((imageId, images) => {
        setPreviewImages(images);
        setInitialPreviewImageId(imageId);
        setIsImagePreviewModalOpen(true);
    }, []);
    if (!messages || messages.length === 0) {
        return (<div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <p className="text-sm">Chưa có tin nhắn nào</p>
          <p className="text-xs text-gray-400 mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      </div>);
    }
    return (<div className={`relative h-full ${className}`}>
      {/* Swipe hint overlay */}
      {showSwipeHint && (<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
          <div className="bg-black bg-opacity-80 text-white text-sm px-4 py-2 rounded-full flex items-center space-x-2 animate-pulse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            <span>Vuốt phải để quay lại</span>
          </div>
        </div>)}

      {/* Scroll to bottom button */}
      {showScrollToBottomButton && (<div className="absolute bottom-20 right-4 z-10">
          <button onClick={() => scrollToBottom(true)} className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors" aria-label="Scroll to bottom">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        </div>)}

      {/* Scrollable message container */}
      <div ref={(el) => {
            scrollRef.current = el;
            if (messageSwipeRef.current !== el) {
                messageSwipeRef.current = el;
            }
        }} className="h-full overflow-y-auto p-3 sm:p-4" style={{
            WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        }} onScroll={handleScroll}>
        {/* Loading more indicator */}
        {isLoadingMore && (<div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm">Đang tải thêm tin nhắn...</span>
            </div>
          </div>)}

        {/* Load more button */}
        {hasMore && !isLoadingMore && (<div className="flex justify-center py-4">
            <button onClick={onLoadMore} className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Tải thêm tin nhắn
            </button>
          </div>)}

        {/* Message groups */}
        <div className="space-y-3 sm:space-y-4">
          {messageGroups.map((group, groupIndex) => (<div key={group.date}>
              <DateDivider date={new Date(group.date)} customLabel={formatDateLabel(new Date(group.date))}/>
              <div className="space-y-1 sm:space-y-2">
                {group.messages.map((message, messageIndex) => {
                const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
                const isGrouped = (prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.senderId) === message.senderId &&
                    new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 300000; // 5 minutes
                return (<MessageItem key={message.id} message={message} isGrouped={isGrouped} onImageClick={handleImageClick} // Pass the handler down
                />);
            })}
              </div>
            </div>))}
        </div>

        {/* Typing indicator */}
        {conversationId && <TypingIndicator conversationId={conversationId}/>}
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewModalOpen && (<ImagePreviewModal images={previewImages} initialImageId={initialPreviewImageId} onClose={() => setIsImagePreviewModalOpen(false)}/>)}
    </div>);
}
