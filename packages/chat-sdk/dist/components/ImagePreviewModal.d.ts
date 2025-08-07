interface ImagePreviewModalProps {
    images: {
        id: string;
        url: string;
        name?: string;
    }[];
    initialImageId: string;
    onClose: () => void;
}
export declare function ImagePreviewModal({ images, initialImageId, onClose }: ImagePreviewModalProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=ImagePreviewModal.d.ts.map