"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages:  Message[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="font-display text-6xl text-[var(--border)] tracking-widest amber-glow-text select-none">
          RAG
        </div>
        <div className="text-[10px] text-[var(--dim)] tracking-[0.3em] uppercase font-mono">
          Upload &amp; process a document<br />then ask anything about it
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-sm">
          {["What is this document about?", "Summarize the key points", "What are the main topics?"].map((hint, i) => (
            <div
              key={i}
              className="px-2 py-2 rounded border border-[var(--border)] text-[10px] text-[var(--dim)] font-mono text-center leading-relaxed"
            >
              {hint}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      {messages.map((msg, i) => (
        <MessageBubble key={msg.id} message={msg} index={i} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="self-start flex items-center gap-2 px-4 py-3 rounded border border-[var(--border)] border-l-2 border-l-[var(--amber)] bg-[var(--panel)]">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-[var(--dim)] font-mono tracking-wider">Retrieving context…</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
