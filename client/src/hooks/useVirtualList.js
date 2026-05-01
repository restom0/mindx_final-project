import {useLayoutEffect, useMemo, useRef, useState} from "react";

export function useVirtualList({itemCount, itemHeight, overscan = 5}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(520);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const updateHeight = () => setViewportHeight(element.clientHeight || 520);
    updateHeight();

    if (!window.ResizeObserver) {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const range = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
    );

    return {start, end};
  }, [itemCount, itemHeight, overscan, scrollTop, viewportHeight]);

  const virtualItems = useMemo(() => {
    if (itemCount === 0) {
      return [];
    }

    return Array.from({length: range.end - range.start + 1}, (_, offset) => {
      const index = range.start + offset;
      return {
        index,
        offsetTop: index * itemHeight
      };
    });
  }, [itemCount, itemHeight, range.end, range.start]);

  return {
    containerRef,
    onScroll: (event) => setScrollTop(event.currentTarget.scrollTop),
    totalHeight: itemCount * itemHeight,
    virtualItems
  };
}
