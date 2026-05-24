/// <reference types="vite/client" />

interface Window {
  particlesJS?: (id: string, config: unknown) => void;
  pJSDom?: Array<{
    canvas?: {
      el?: HTMLElement & { parentElement?: HTMLElement | null };
    };
    pJS: {
      fn: {
        vendors: {
          destroypJS: () => void;
        };
      };
    };
  }>;
}

declare module 'react-pageflip' {
  import * as React from 'react';

  export interface FlipBookProps {
    width?: number;
    height?: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startPage?: number;
    useMouseEvents?: boolean;
    showCover?: boolean;
    showDoublePage?: boolean;
    maxShadowOpacity?: number;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onFlip?: (e: { data: number }) => void;
    onChangeOrientation?: (e: { data: 'portrait' | 'landscape' }) => void;
    onChangeState?: (e: { data: 'user_fold' | 'fold_corner' | 'flipping' | 'read' }) => void;
    onInit?: (e: { data: unknown }) => void;
    onUpdate?: (e: { data: unknown }) => void;
  }

  export interface PageFlipInstance {
    pageFlip: () => {
      flipPrev: () => void;
      flipNext: () => void;
      flip: (page: number) => void;
      getCurrentPageIndex: () => number;
      getPageCount: () => number;
    };
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<FlipBookProps & React.RefAttributes<PageFlipInstance>>;
  export default HTMLFlipBook;
}
