"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { CaretUpIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/app/lib/utils";

function ScrollToTop() {
  const [visible, setVisble] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisble(window.scrollY > 500);
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <Button
      onClick={scrollTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full shadow-xl transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <CaretUpIcon size={22} weight="bold" />
    </Button>
  );
}

export default ScrollToTop;
