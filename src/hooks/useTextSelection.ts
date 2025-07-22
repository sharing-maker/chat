"use client"

import { useCallback, useRef } from "react"

export function useTextSelection() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getSelection = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return null

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    return {
      start,
      end,
      selectedText,
      hasSelection: start !== end,
    }
  }, [])

  const replaceSelection = useCallback((newText: string, selectReplaced = false) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = textarea.value

    const newValue = value.substring(0, start) + newText + value.substring(end)

    // Update the textarea value
    textarea.value = newValue

    // Trigger change event
    const event = new Event("input", { bubbles: true })
    textarea.dispatchEvent(event)

    // Set cursor position
    if (selectReplaced) {
      textarea.setSelectionRange(start, start + newText.length)
    } else {
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }

    textarea.focus()
  }, [])

  const wrapSelection = useCallback(
    (prefix: string, suffix: string = prefix) => {
      const selection = getSelection()
      if (!selection) return

      const { selectedText, hasSelection } = selection

      if (hasSelection) {
        // Wrap selected text
        const wrappedText = `${prefix}${selectedText}${suffix}`
        replaceSelection(wrappedText, true)
      } else {
        // Insert formatting markers at cursor
        const placeholder = prefix === suffix ? "text" : "link"
        const wrappedText = `${prefix}${placeholder}${suffix}`
        replaceSelection(wrappedText, true)
      }
    },
    [getSelection, replaceSelection],
  )

  const applyFormat = useCallback(
    (format: string) => {
      const selection = getSelection()
      if (!selection) return

      const { selectedText, hasSelection, start } = selection

      switch (format) {
        case "bold":
          wrapSelection("**")
          break
        case "italic":
          wrapSelection("*")
          break
        case "strikethrough":
          wrapSelection("~~")
          break
        case "code":
          wrapSelection("`")
          break
        case "quote":
          if (hasSelection) {
            const quotedText = selectedText
              .split("\n")
              .map((line) => `> ${line}`)
              .join("\n")
            replaceSelection(quotedText)
          } else {
            replaceSelection("> ")
          }
          break
        case "link":
          if (hasSelection) {
            const linkText = `[${selectedText}](url)`
            replaceSelection(linkText, true)
          } else {
            replaceSelection("[text](url)", true)
          }
          break
        case "numbered-list":
          if (hasSelection) {
            const listText = selectedText
              .split("\n")
              .map((line, index) => `${index + 1}. ${line}`)
              .join("\n")
            replaceSelection(listText)
          } else {
            replaceSelection("1. ")
          }
          break
        case "bullet-list":
          if (hasSelection) {
            const listText = selectedText
              .split("\n")
              .map((line) => `• ${line}`)
              .join("\n")
            replaceSelection(listText)
          } else {
            replaceSelection("• ")
          }
          break
        default:
          break
      }
    },
    [getSelection, wrapSelection, replaceSelection],
  )

  return {
    textareaRef,
    getSelection,
    replaceSelection,
    wrapSelection,
    applyFormat,
  }
}
