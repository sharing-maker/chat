"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { $createQuoteNode } from "@lexical/rich-text"
import { $createCodeNode } from "@lexical/code"
import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useCallback } from "react"

export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()

  const formatText = useCallback(
    (format: "bold" | "italic" | "strikethrough") => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
    },
    [editor],
  )

  const insertList = useCallback(
    (listType: "number" | "bullet") => {
      if (listType === "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      }
    },
    [editor],
  )

  const insertQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode()
        selection.insertNodes([quote])
      }
    })
  }, [editor])

  const insertCode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const code = $createCodeNode()
        selection.insertNodes([code])
      }
    })
  }, [editor])

  const insertLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")
  }, [editor])

  return (
    <div className="flex items-center gap-1 pb-2 border-b border-gray-100">
      <button
        onClick={() => formatText("bold")}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Bold"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3v14h5.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.8-2.8-2-3.5 1.2-.7 2-2 2-3.5C15 3 13 1 10.5 1H5v2zm2 2h3.5c1.4 0 2.5 1.1 2.5 2.5S11.9 10 10.5 10H7V5zm0 7h4c1.7 0 3 1.3 3 3s-1.3 3-3 3H7v-6z" />
        </svg>
      </button>

      <button
        onClick={() => formatText("italic")}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Italic"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 1h8v2h-2.5l-3 12H13v2H5v-2h2.5l3-12H8V1z" />
        </svg>
      </button>

      <button
        onClick={() => formatText("strikethrough")}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Strikethrough"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10h16v2H2v-2zm3-6h10v2H5V4zm0 12h10v-2H5v2z" />
        </svg>
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        onClick={() => insertList("number")}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Numbered List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h1v1H3V4zm0 3h1v1H3V7zm0 3h1v1H3v-1zm3-6h11v2H6V4zm0 3h11v2H6V7zm0 3h11v2H6v-2z" />
        </svg>
      </button>

      <button
        onClick={() => insertList("bullet")}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Bulleted List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 6a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0zM4 18a2 2 0 11-4 0 2 2 0 014 0zM8 5h11v2H8V5zM8 11h11v2H8v-2zM8 17h11v2H8v-2z" />
        </svg>
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        onClick={insertLink}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Link"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
        </svg>
      </button>

      <button
        onClick={insertQuote}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Quote"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10c0-2 1.5-4 4-4s4 2 4 4-1.5 4-4 4-4-2-4-4zm8 0c0-2 1.5-4 4-4s4 2 4 4-1.5 4-4 4-4-2-4-4z" />
        </svg>
      </button>

      <button
        onClick={insertCode}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Code"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.962 8.795l1.414-1.414L12 4l-3.376 3.381 1.414 1.414L12 6.828l1.962 1.967zM6.038 11.205l-1.414 1.414L8 16l3.376-3.381-1.414-1.414L8 13.172l-1.962-1.967z" />
        </svg>
      </button>
    </div>
  )
}
