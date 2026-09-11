"use client";

import { useState, useRef } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Modal from "../shared/Modal";

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Search Patina catalog"
      position="center"
      panelClassName="max-w-2xl overflow-hidden rounded-2xl mt-12 sm:mt-0"
      initialFocusRef={inputRef}
    >
      <div className="flex flex-col">
        {/* Search Header Bar */}
        <div className="border-border flex items-center border-b px-4 py-3 sm:px-6">
          <MagnifyingGlassIcon
            size={23}
            weight="bold"
            className="text-primary-dark mr-2 shrink-0"
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search site input"
            className="text-heading placeholder:text-heading/40 search-input w-full bg-transparent px-4 pb-2 text-base font-medium outline-none sm:text-lg"
          />

          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-heading/50 hover:text-heading mr-2 text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search modal"
            className="hover:bg-primary-light/50 text-heading/70 hover:text-heading flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        {/* Footer Hint Bar */}
        <div className="border-border bg-primary-light/20 text-heading/60 flex items-center justify-between rounded-b-2xl border-t px-6 py-3 text-xs">
          <span>
            Press{" "}
            <kbd className="border-border bg-background rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
              ESC
            </kbd>{" "}
            to exit
          </span>
        </div>
      </div>
    </Modal>
  );
}

export default SearchModal;
