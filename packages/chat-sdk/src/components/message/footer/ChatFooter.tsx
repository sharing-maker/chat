"use client"

import { useState, useRef, useEffect } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ToolbarPlugin } from "./ToolbarPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { LinkNode } from "@lexical/link"
import EmojiPicker from "./EmojiPicker"
import StickerPicker from "./StickerPicker"

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    strikethrough: "line-through",
    underline: "underline",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
  code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
  codeblock: "bg-gray-100 p-3 rounded-lg font-mono text-sm",
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside",
    ul: "list-disc list-inside",
  },
  link: "text-blue-500 underline hover:text-blue-700",
}

const onError = (error: Error) => {
  console.error(error)
}

const initialConfig = {
  namespace: "ChatFooter",
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, LinkNode],
}

const ChatFooter = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
        setShowStickerPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleEmojiSelect = (emoji: string) => {
    console.log("[v0] Selected emoji:", emoji)
    // TODO: Insert emoji into editor
    setShowEmojiPicker(false)
  }

  const handleStickerSelect = (sticker: string) => {
    console.log("[v0] Selected sticker:", sticker)
    // TODO: Insert sticker into editor
    setShowStickerPicker(false)
  }

  return (
    <div ref={containerRef} className="border border-gray-200 rounded-2xl bg-white p-3 relative">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />

        <div className="bg-blue-50 rounded-xl p-3 min-h-[50px] my-3">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none resize-none text-sm leading-relaxed" />}
            placeholder={
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="text-gray-500 text-sm">Enter message</span>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-lg">Aa</span>
            </button>
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker)
                setShowStickerPicker(false)
              }}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                showEmojiPicker ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🙂
            </button>
            <button
              onClick={() => {
                setShowStickerPicker(!showStickerPicker)
                setShowEmojiPicker(false)
              }}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                showStickerPicker ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              😀
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              🖼️
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              📎
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              👤
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              🎤
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              📡
            </button>

            {showEmojiPicker && (
              <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
            )}

            {showStickerPicker && (
              <StickerPicker onStickerSelect={handleStickerSelect} onClose={() => setShowStickerPicker(false)} />
            )}
          </div>

          <button className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
            👍
          </button>
        </div>

        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
      </LexicalComposer>
    </div>
  )
}

export default ChatFooter
