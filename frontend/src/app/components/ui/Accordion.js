"use client";

import { cn } from "@/app/lib/utils";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={cn(
              "overflow-hidden rounded-xl border transition-all duration-200",
              isOpen
                ? "border-primary/40 bg-background ring-primary/20 shadow-xs ring-1"
                : "border-border bg-background hover:border-border/80",
            )}
          >
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between p-6 text-left focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="bg-primary-light text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    {item.icon}
                  </div>
                )}

                <h3 className="text-heading text-lg font-bold tracking-tight">
                  {item.question}
                </h3>
              </div>

              <CaretDownIcon
                size={20}
                weight="bold"
                className={cn(
                  "text-muted shrink-0 transition-transform duration-300",
                  isOpen && "rorate-180 text-primary-dark",
                )}
              />
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "border-border/60 border-t px-6 pt-4 pb-6 text-base leading-relaxed transition-transform duration-300 ease-out",
                    isOpen ? "translate-y-0" : "-translate-y-2",
                  )}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
