"use client";

import { useState, useRef } from "react";
import { Upload, RotateCcw, FileText, AlertCircle } from "lucide-react";
import clsx from "clsx";
import PipelineStep from "./PipelineStep";
import { uploadDocument, ingestDocument, chunkDocument, embedDocument } from "@/lib/api";
import { DocState, FileType, PipelineStep as PStep } from "@/lib/types";

interface Props {
  docState:    DocState | null;
  onDocChange: (state: DocState | null) => void;
  onReset:     () => void;
}

type StepKey = "upload" | "ingest" | "chunk" | "embed";

export default function Sidebar({ docState, onDocChange, onReset }: Props) {
  const [loadingStep, setLoadingStep] = useState<StepKey | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const step = docState?.pipelineStep ?? 0;

  const setStep = (s: PStep) => {
    if (!docState) return;
    onDocChange({ ...docState, pipelineStep: s });
  };

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.match(/\.(pdf|pptx)$/i)) {
      setError("Only PDF and PPTX files are supported.");
      return;
    }
    setLoadingStep("upload");
    try {
      const res = await uploadDocument(file);
      onDocChange({
        documentId:   res.document_id,
        docName:      file.name,
        fileType:     file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "pptx",
        pipelineStep: 1,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoadingStep(null);
    }
  };

  const handleIngest = async () => {
    if (!docState) return;
    setError(null);
    setLoadingStep("ingest");
    try {
      await ingestDocument(docState.documentId, docState.fileType);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ingest failed");
    } finally {
      setLoadingStep(null);
    }
  };

  const handleChunk = async () => {
    if (!docState) return;
    setError(null);
    setLoadingStep("chunk");
    try {
      await chunkDocument(docState.documentId);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Chunking failed");
    } finally {
      setLoadingStep(null);
    }
  };

  const handleEmbed = async () => {
    if (!docState) return;
    setError(null);
    setLoadingStep("embed");
    try {
      await embedDocument(docState.documentId);
      setStep(4);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Embedding failed");
    } finally {
      setLoadingStep(null);
    }
  };

  const stepStatus = (forStep: number, key: StepKey) => {
    if (step >= forStep)           return "done";
    if (loadingStep === key)       return "loading";
    if (step === forStep - 1)      return "active";
    if (step < forStep - 1)        return "locked";
    return "idle";
  };

  return (
    <aside className="
      w-72 flex-shrink-0 border-r border-[var(--border)]
      bg-[var(--panel)] flex flex-col h-full
    ">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <div className="font-display text-3xl text-[var(--bright)] tracking-widest leading-none">
          DOC<span className="text-amber">·</span>PIPELINE
        </div>
        <div className="text-[9px] text-[var(--dim)] tracking-[0.25em] uppercase font-mono mt-1">
          Upload → Process → Chat
        </div>
      </div>

      {/* Upload zone */}
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <div className="text-[9px] text-[var(--dim)] tracking-widest uppercase font-mono mb-2">
          01 · Document
        </div>

        {docState ? (
          // Active doc card
          <div className="flex items-start gap-2 p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
            <FileText size={14} className="text-[var(--amber)] flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-[var(--text)] font-mono truncate">{docState.docName}</div>
              <div className="text-[9px] text-[var(--dim)] mt-0.5 font-mono truncate">{docState.documentId.slice(0,20)}…</div>
            </div>
          </div>
        ) : (
          // Drop zone
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 p-5 rounded border border-dashed cursor-pointer transition-all duration-200",
              dragOver
                ? "border-[var(--amber)] bg-[var(--amber-glow)] scale-[1.02]"
                : "border-[var(--muted)] hover:border-[var(--amber)] hover:bg-[var(--amber-glow)]"
            )}
          >
            <Upload size={18} className={dragOver ? "text-[var(--amber)]" : "text-[var(--dim)]"} />
            <div className="text-[10px] text-[var(--dim)] font-mono text-center leading-relaxed">
              {loadingStep === "upload" ? (
                <span className="text-[var(--amber)]">Uploading…</span>
              ) : (
                <>Drop PDF / PPTX here<br />or click to browse</>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.pptx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Pipeline steps */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-2">
        <div className="text-[9px] text-[var(--dim)] tracking-widest uppercase font-mono mb-1">
          Pipeline Steps
        </div>

        <PipelineStep
          number={1} label="UPLOAD"
          sublabel="Store file on server"
          status={stepStatus(1, "upload")}
        />
        <PipelineStep
          number={2} label="INGEST"
          sublabel="Extract text from pages"
          status={stepStatus(2, "ingest")}
          onClick={handleIngest}
        />
        <PipelineStep
          number={3} label="CHUNK"
          sublabel="Split into token windows"
          status={stepStatus(3, "chunk")}
          onClick={handleChunk}
        />
        <PipelineStep
          number={4} label="EMBED"
          sublabel="Index vectors in FAISS"
          status={stepStatus(4, "embed")}
          onClick={handleEmbed}
        />

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-[9px] text-[var(--dim)] font-mono mb-1.5">
            <span className="tracking-widest uppercase">Progress</span>
            <span className="text-[var(--amber)]">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--amber)] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded border border-[var(--red)] bg-[rgba(240,80,96,0.08)] animate-fade-in mt-2">
            <AlertCircle size={13} className="text-[var(--red)] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[var(--red)] font-mono leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <button
          onClick={onReset}
          className="
            w-full flex items-center justify-center gap-2
            px-3 py-2 rounded border border-[var(--border)]
            text-[10px] text-[var(--dim)] font-mono tracking-widest uppercase
            hover:border-[var(--red)] hover:text-[var(--red)]
            transition-all duration-200
          "
        >
          <RotateCcw size={11} />
          Reset Session
        </button>
      </div>
    </aside>
  );
}
