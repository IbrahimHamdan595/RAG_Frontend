"use client";

import { useState, useCallback } from "react";
import Sidebar    from "@/components/Sidebar";
import StatusBar  from "@/components/StatusBar";
import ChatWindow from "@/components/ChatWindow";
import ChatInput  from "@/components/ChatInput";
import { useChatStore, useDocStore } from "@/lib/useChatStore";
import { askQuestion } from "@/lib/api";
import { PipelineStep } from "@/lib/types";

export default function Home() {
  // FIX: docState now comes from useDocStore (persisted to localStorage)
  const { docState, setDocState }              = useDocStore();
  const { messages, addMessage, clearHistory } = useChatStore();
  const [loadingState, setLoadingState]        = useState(false);

  const handleReset = useCallback(() => {
    setDocState(null);
    clearHistory();
  }, [setDocState, clearHistory]);

  const handleSend = useCallback(async (question: string) => {
    if (!docState || docState.pipelineStep !== 4) return;

    addMessage({ role: "user", content: question });
    setLoadingState(true);

    try {
      const res = await askQuestion(question);
      addMessage({ role: "assistant", content: res.answer, sources: res.sources });
    } catch (e: unknown) {
      addMessage({
        role:    "assistant",
        content: `⚠ Error: ${e instanceof Error ? e.message : "Something went wrong"}`,
      });
    } finally {
      setLoadingState(false);
    }
  }, [docState, addMessage, setLoadingState]);

  const ready = docState?.pipelineStep === 4;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] grid-bg overflow-hidden">
      <StatusBar
        docName      = {docState?.docName ?? null}
        pipelineStep = {(docState?.pipelineStep ?? 0) as PipelineStep}
        msgCount     = {messages.length}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          docState    = {docState}
          onDocChange = {setDocState}
          onReset     = {handleReset}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2.5 border-b border-[var(--border)] bg-[var(--panel)] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="font-display text-xl text-[var(--bright)] tracking-widest">
                CHAT<span className="text-[var(--amber)]">·</span>INTERFACE
              </div>
              {ready && (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                  <span className="text-[9px] text-[var(--green)] font-mono tracking-widest uppercase">Live</span>
                </div>
              )}
            </div>

            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[9px] text-[var(--dim)] font-mono tracking-widest uppercase hover:text-[var(--red)] transition-colors duration-200 flex items-center gap-1.5"
              >
                Clear history
              </button>
            )}
          </div>

          <ChatWindow messages={messages} isLoading={loadingState} />
          <ChatInput onSend={handleSend} disabled={!ready} isLoading={loadingState} />
        </main>
      </div>
    </div>
  );
}
