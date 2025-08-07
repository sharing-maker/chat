export declare function useTextSelection(): {
    textareaRef: import("react").RefObject<HTMLTextAreaElement>;
    getSelection: () => {
        start: number;
        end: number;
        selectedText: string;
        hasSelection: boolean;
    } | null;
    replaceSelection: (newText: string, selectReplaced?: boolean) => void;
    wrapSelection: (prefix: string, suffix?: string) => void;
    applyFormat: (format: string) => void;
};
//# sourceMappingURL=useTextSelection.d.ts.map