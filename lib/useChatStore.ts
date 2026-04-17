"use client";

import { useState, useEffect, useCallback } from "react";
import { Message, DocState } from "./types";

const MESSAGES_KEY = "rag_chat_history";
const DOC_KEY      = "rag_doc_state";

// ── Chat history ──────────────────────────────────────────────────────────────

export function useChatStore() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages)); }
    catch {}
  }, [messages, loaded]);

  const addMessage = useCallback((msg: Omit<Message, "id" | "ts">) => {
    const full: Message = { ...msg, id: crypto.randomUUID(), ts: Date.now() };
    setMessages(prev => [...prev, full]);
    return full;
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(MESSAGES_KEY);
  }, []);

  return { messages, addMessage, clearHistory, loaded };
}

// ── Document / pipeline state ─────────────────────────────────────────────────
// FIX: persists docState to localStorage so a page refresh doesn't lose
// the uploaded document and pipeline progress.

export function useDocStore() {
  const [docState, setDocStateRaw] = useState<DocState | null>(null);
  const [loaded,   setLoaded]      = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DOC_KEY);
      if (raw) setDocStateRaw(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  // Persist whenever docState changes
  const setDocState = useCallback((state: DocState | null) => {
    setDocStateRaw(state);
    try {
      if (state) localStorage.setItem(DOC_KEY, JSON.stringify(state));
      else        localStorage.removeItem(DOC_KEY);
    } catch {}
  }, []);

  return { docState, setDocState, loaded };
}