"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Send } from "lucide-react";
import clsx from "clsx";

interface Props {
  onSend:    (question: string) => void;
  disabled:  boolean;
  isLoading: boolean;
}

// Detect if text contains Arabic characters
function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export default function ChatInput({ onSend, disabled, isLoading }: Props) {
  const [value,  setValue]  = useState("");
  const [isRTL,  setIsRTL]  = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-detect direction as user types
  useEffect(() => {
    if (value.trim()) setIsRTL(isArabic(value));
  }, [value]);

  const handleSend = () => {
    const q = value.trim();
    if (!q || disabled || isLoading) return;
    onSend(q);
    setValue("");
    setIsRTL(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--panel)] px-4 py-3">

      {/* Hint bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] text-[var(--muted)] font-mono tracking-widest uppercase">
          {disabled
            ? "⟳  Complete pipeline to enable chat"
            : isRTL
              ? "↵ إرسال  ·  Shift+↵ سطر جديد"
              : "↵  Send  ·  Shift+↵  Newline"
          }
        </span>

        {/* Language indicator */}
        {!disabled && value.trim() && (
          <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border border-[var(--border)]"
            style={{ color: isRTL ? "var(--amber)" : "var(--dim)" }}>
            {isRTL ? "عربي" : "EN"}
          </span>
        )}
      </div>

      <div className={clsx(
        "flex items-end gap-2 rounded border transition-all duration-200",
        disabled
          ? "border-[var(--border)] opacity-40"
          : "border-[var(--muted)] focus-within:border-[var(--amber)] focus-within:amber-glow-sm"
      )}>

        {/* Prompt symbol — flips side for RTL */}
        {!isRTL && (
          <div className="pl-3 pb-3 text-[var(--amber)] font-mono text-sm select-none self-end">
            &gt;_
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled || isLoading}
          rows={1}
          dir={isRTL ? "rtl" : "ltr"}
          placeholder={
            disabled
              ? "Upload and process a document first…"
              : isRTL
                ? "اسأل أي سؤال عن المستند…"
                : "Ask anything about your document…"
          }
          className={clsx(
            "flex-1 resize-none bg-transparent outline-none border-none",
            "font-mono text-sm text-[var(--text)] placeholder:text-[var(--muted)]",
            "py-3 leading-relaxed min-h-[44px]",
            isRTL ? "pr-3 pl-2 text-right" : "pl-0 pr-2 text-left"
          )}
        />

        {/* RTL prompt symbol */}
        {isRTL && (
          <div className="pr-3 pb-3 text-[var(--amber)] font-mono text-sm select-none self-end">
            _&lt;
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || isLoading || !value.trim()}
          className={clsx(
            "flex-shrink-0 mb-2 mr-2 w-8 h-8 rounded flex items-center justify-center transition-all duration-200",
            (!disabled && value.trim() && !isLoading)
              ? "bg-[var(--amber)] text-[var(--bg)] hover:scale-110 active:scale-95"
              : "bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed"
          )}
        >
          <Send size={13} strokeWidth={2} style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
        </button>
      </div>

      {value.length > 200 && (
        <div className="text-[9px] text-[var(--dim)] font-mono mt-1 text-right">
          {value.length} chars
        </div>
      )}
    </div>
  );
}
