import { useEffect, useRef, useState } from 'react';
import { TIMEOUT, OPACITY, RESTORE_OPACITY } from '../utils';

export interface CarouselHookResult {
  currentIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useCarousel = (images: string[]): CarouselHookResult => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProcessingScroll = useRef<boolean>(false);
  console.log(currentImageIndex)

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (!isProcessingScroll.current) {
        const container = containerRef.current;

        if (container) {
          if (scrollTimeoutRef.current !== null) {
            window.clearTimeout(scrollTimeoutRef.current);
          }
          const { deltaY, deltaX } = event;

          console.log("X",deltaX , "Y",deltaY)
          console.log(new Date())
          isProcessingScroll.current = true;
          container.style.opacity = OPACITY;

          scrollTimeoutRef.current = window.setTimeout(() => {
            setCurrentImageIndex((prevIndex) => {
              if (deltaY > 0 || deltaX > 0) {
                return prevIndex < images.length - 1 ? prevIndex + 1 : 0;
              }
              if (deltaY < 0 || deltaX < 0) {
                return prevIndex > 0 ? prevIndex - 1 : images.length - 1;
              }
              return prevIndex;
            });
            setTimeout(() => {
              isProcessingScroll.current = false;
            }, 1200);
            container.style.opacity = RESTORE_OPACITY;
          }, 200);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, [images.length]);

  return { currentIndex: currentImageIndex, containerRef };
};
