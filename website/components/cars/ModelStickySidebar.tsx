"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ModelStickySidebar({ children }: { children: ReactNode }) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    let frame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = Math.min(164, window.innerHeight - sidebar.offsetHeight - 24);
        sidebar.style.setProperty("--model-sidebar-top", `${top}px`);
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    const observer = new ResizeObserver(updatePosition);
    observer.observe(sidebar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      observer.disconnect();
    };
  }, []);

  return <aside ref={sidebarRef} className="model-sticky-sidebar space-y-4">{children}</aside>;
}
