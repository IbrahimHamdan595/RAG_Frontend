import { FileType } from "./types";

// Fast requests go through Vercel's rewrite proxy (/api/...)
// Long-running requests (embed, ask) call the backend directly to avoid Vercel's 30s timeout
const PROXY  = "/api";
const DIRECT = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api";

async function post<T>(base: string, path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
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
  return post(PROXY, "/upload", { body: form });
}

// ── Ingest ────────────────────────────────────────────────────────────────────
export async function ingestDocument(
  documentId: string,
  fileType: FileType
): Promise<{ document_id: string; total_pages?: number; slides_ingested?: number }> {
  return post(PROXY, `/ingest/${fileType}/${documentId}`);
}

// ── Chunk ─────────────────────────────────────────────────────────────────────
export async function chunkDocument(
  documentId: string
): Promise<{ document_id: string; chunked_count: number }> {
  return post(PROXY, `/chunk/${documentId}`);
}

// ── Embed — bypasses Vercel proxy (HF API calls can exceed 30s timeout) ───────
export async function embedDocument(
  documentId: string
): Promise<{ document_id: string; chunks_embedded: number }> {
  return post(DIRECT, `/embed/${documentId}`);
}

// ── Ask — bypasses Vercel proxy (LLM response can exceed 30s timeout) ─────────
export async function askQuestion(
  question: string
): Promise<{ answer: string; sources: Array<{ source: string; unit_number: number; document_id: string; score: number }> }> {
  return post(DIRECT, "/ask", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}
