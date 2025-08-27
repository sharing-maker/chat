"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { $createQuoteNode } from "@lexical/rich-text"
import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useCallback, useEffect, useState } from "react"

export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    strikethrough: false,
  })

  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          setActiveFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            strikethrough: selection.hasFormat("strikethrough"),
          })
        }
      })
    })
  }, [editor])

  const formatText = useCallback(
    (format: "bold" | "italic" | "strikethrough") => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
    },
    [editor],
  )

  const insertList = useCallback(
    (listType: "number" | "bullet") => {
      const newActiveFeature = activeFeature === listType ? null : listType
      setActiveFeature(newActiveFeature)

      if (listType === "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      }
    },
    [editor, activeFeature],
  )

  const insertQuote = useCallback(() => {
    const newActiveFeature = activeFeature === "quote" ? null : "quote"
    setActiveFeature(newActiveFeature)

    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode()
        selection.insertNodes([quote])
      }
    })
  }, [editor, activeFeature])

  const insertLink = useCallback(() => {
    const newActiveFeature = activeFeature === "link" ? null : "link"
    setActiveFeature(newActiveFeature)

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")
  }, [editor, activeFeature])

  const getButtonClasses = (isActive: boolean) => {
    return `p-2 rounded transition-colors ${
      isActive ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`
  }

  return (
    <div className="flex items-center gap-1 pb-2 border-b border-gray-100">
      <button onClick={() => formatText("bold")} className={getButtonClasses(activeFormats.bold)} title="Bold">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3v14h5.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.8-2.8-2-3.5 1.2-.7 2-2 2-3.5C15 3 13 1 10.5 1H5v2zm2 2h3.5c1.4 0 2.5 1.1 2.5 2.5S11.9 10 10.5 10H7V5zm0 7h4c1.7 0 3 1.3 3 3s-1.3 3-3 3H7v-6z" />
        </svg>
      </button>

      <button onClick={() => formatText("italic")} className={getButtonClasses(activeFormats.italic)} title="Italic">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 1h8v2h-2.5l-3 12H13v2H5v-2h2.5l3-12H8V1z" />
        </svg>
      </button>

      <button
        onClick={() => formatText("strikethrough")}
        className={getButtonClasses(activeFormats.strikethrough)}
        title="Strikethrough"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10h16v2H2v-2zm3-6h1v1H3V4zm0 12h1v1H3v-2zm3-6h1v1H3V4zm0 12h1v1H3v-2zm3-6h1v1H3V4zm0 12h1v1H3v-2z" />
        </svg>
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        onClick={() => insertList("number")}
        className={getButtonClasses(activeFeature === "number")}
        title="Numbered List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h1v1H3V4zm0 3h1v1H3V7zm0 3h1v1H3v-1zm3-6h11v2H6V4zm0 3h11v2H6V7zm0 3h11v2H6v-2z" />
        </svg>
      </button>

      <button
        onClick={() => insertList("bullet")}
        className={getButtonClasses(activeFeature === "bullet")}
        title="Bulleted List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 6a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0zM4 18a2 2 0 11-4 0 2 2 0 014 0zM8 5h11v2H8V5zM8 11h11v2H8v-2zM8 17h11v2H8v-2z" />
        </svg>
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button onClick={insertLink} className={getButtonClasses(activeFeature === "link")} title="Link">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
        </svg>
      </button>

      <button onClick={insertQuote} className={getButtonClasses(activeFeature === "quote")} title="Quote">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10c0-2 1.5-4 4-4s4 2 4 4-1.5 4-4 4-4-2-4-4zm8 0c0-2 1.5-4 4-4s4 2 4 4-1.5 4-4 4-4-2-4-4z" />
        </svg>
      </button>
    </div>
  )
}
