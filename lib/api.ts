import { FileType } from "./types";

const BASE = "/api"; // proxied to http://localhost:8000/api via next.config.ts

async function post<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "API error");
  }

  return res.json() as Promise<T>;
}

// ── Upload ────────────────────────────────────────────────────────────────────
export async function uploadDocument(file: File): Promise<{ document_id: string; status: string }> {
  const form = new FormData();
  form.append("file", file);
  return post("/upload", { body: form });
}

// ── Ingest ────────────────────────────────────────────────────────────────────
export async function ingestDocument(
  documentId: string,
  fileType: FileType
): Promise<{ document_id: string; total_pages?: number; slides_ingested?: number }> {
  return post(`/ingest/${fileType}/${documentId}`);
}

// ── Chunk ─────────────────────────────────────────────────────────────────────
export async function chunkDocument(
  documentId: string
): Promise<{ document_id: string; chunked_count: number }> {
  return post(`/chunk/${documentId}`);
}

// ── Embed ─────────────────────────────────────────────────────────────────────
export async function embedDocument(
  documentId: string
): Promise<{ document_id: string; chunks_embedded: number }> {
  return post(`/embed/${documentId}`);
}

// ── Ask ───────────────────────────────────────────────────────────────────────
export async function askQuestion(
  question: string
): Promise<{ answer: string; sources: Array<{ source: string; unit_number: number; document_id: string; score: number }> }> {
  return post("/ask", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}
