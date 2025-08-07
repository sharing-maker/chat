interface SwipeGestureOptions {
    onSwipeRight?: () => void;
    onSwipeLeft?: () => void;
    threshold?: number;
    restraint?: number;
    allowedTime?: number;
    enabled?: boolean;
}
export declare function useSwipeGesture({ onSwipeRight, onSwipeLeft, threshold, restraint, allowedTime, enabled, }: SwipeGestureOptions): import("react").RefObject<HTMLElement>;
export {};
//# sourceMappingURL=useSwipeGesture.d.ts.map