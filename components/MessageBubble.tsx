import { Message } from "@/lib/types";
import SourcePills from "./SourcePills";
import clsx from "clsx";

interface Props {
  message: Message;
  index:   number;
}

function isArabic(text: string): boolean {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars / Math.max(text.length, 1) > 0.2;
}

export default function MessageBubble({ message, index }: Props) {
  const isUser   = message.role === "user";
  const arabic   = isArabic(message.content);
  const textDir  = arabic ? "rtl" : "ltr";
  const textAlign = arabic ? "text-right" : "text-left";

  return (
    <div
      className={clsx(
        "animate-slide-up flex flex-col gap-1 max-w-[88%]",
        // Arabic messages align to the right regardless of user/assistant
        arabic
          ? "self-end items-end"
          : isUser
            ? "self-end items-end"
            : "self-start items-start",
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Role label */}
      <div className={clsx(
        "text-[9px] tracking-widest uppercase font-mono px-1",
        isUser ? "text-[var(--dim)]" : "text-[var(--amber)]",
        arabic ? "text-right" : isUser ? "text-right" : "text-left"
      )}>
        {isUser
          ? (arabic ? "أنت" : "You")
          : (arabic ? "المساعد" : "RAGbot")
        }
      </div>

      {/* Bubble */}
      <div
        dir={textDir}
        className={clsx(
          "relative px-4 py-3 rounded text-sm font-mono leading-relaxed border",
          textAlign,
          isUser
            ? "bg-[var(--surface)] border-[var(--muted)] text-[var(--text)] rounded-br-none"
            : "bg-[var(--panel)] border-[var(--border)] text-[var(--soft)] rounded-bl-none border-l-2 border-l-[var(--amber)]"
        )}
      >
        {/* Amber accent for assistant */}
        {!isUser && (
          <span className="absolute top-0 left-0 w-2 h-2 bg-[var(--amber)] opacity-60 rounded-tl" />
        )}

        <p className="whitespace-pre-wrap">{message.content}</p>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcePills sources={message.sources} />
        )}
      </div>

      {/* Timestamp */}
      <div className={clsx(
        "text-[9px] text-[var(--muted)] font-mono px-1",
        arabic ? "text-right" : ""
      )}>
        {new Date(message.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
