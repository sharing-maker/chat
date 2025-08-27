"use client"

interface StickerPickerProps {
  onStickerSelect: (sticker: string) => void
  onClose: () => void
}

const StickerPicker = ({ onStickerSelect, onClose }: StickerPickerProps) => {
  const stickerPacks = {
    cute: {
      name: "Cute Animals",
      stickers: ["🐱", "🐶", "🐰", "🐻", "🐼", "🐨", "🦊", "🐸", "🐵", "🐧", "🦆", "🐥"],
    },
    hearts: {
      name: "Hearts & Love",
      stickers: ["❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "🤎", "💕", "💖", "💗"],
    },
    gestures: {
      name: "Hand Gestures",
      stickers: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇"],
    },
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg w-80 z-50">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Choose a sticker</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(stickerPacks).map(([key, pack]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{pack.name}</h4>
              <div className="grid grid-cols-6 gap-2">
                {pack.stickers.map((sticker, index) => (
                  <button
                    key={index}
                    onClick={() => onStickerSelect(sticker)}
                    className="p-3 text-2xl hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StickerPicker
