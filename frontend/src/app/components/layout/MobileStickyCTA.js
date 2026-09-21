"use client";

import { useEffect, useState } from "react";
import Button from "../shared/Button";
import { usePathname } from "next/navigation";

function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/consultation") {
    return null;
  }

  return (
    <div
      className={`nav-desktop:hidden fixed bottom-6 left-1/2 z-40 -translate-x-1/2 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Button href="/consultation" size="sm" className="backdrop-blur-2xl">
        Book Consultation
      </Button>
    </div>
  );
}

export default MobileStickyCTA;
