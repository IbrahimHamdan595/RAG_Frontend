import { FileText, Activity, MessageSquare, Cpu } from "lucide-react";
import { PipelineStep } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

const STEP_LABELS: Record<PipelineStep, string> = {
  0: "IDLE",
  1: "UPLOADED",
  2: "INGESTED",
  3: "CHUNKED",
  4: "READY",
};

const STEP_COLORS: Record<PipelineStep, string> = {
  0: "text-[var(--dim)]",
  1: "text-[var(--soft)]",
  2: "text-[var(--soft)]",
  3: "text-[var(--soft)]",
  4: "text-[var(--green)]",
};

interface Props {
  docName:      string | null;
  pipelineStep: PipelineStep;
  msgCount:     number;
}

export default function StatusBar({ docName, pipelineStep, msgCount }: Props) {
  return (
    <div className="
      flex items-center gap-0 border-b border-[var(--border)]
      bg-[var(--panel)] text-[10px] font-mono h-9 flex-shrink-0
    ">
      {/* Logo */}
      <div className="
        px-4 h-full flex items-center border-r border-[var(--border)]
        font-display text-lg tracking-widest text-[var(--amber)] amber-glow-text
        select-none
      ">
        RAG
      </div>

      {/* Metrics */}
      <div className="flex-1 flex items-stretch h-full overflow-x-auto no-scrollbar">

        {/* Document */}
        <div className="flex items-center gap-2 px-4 border-r border-[var(--border)] flex-shrink-0">
          <FileText size={11} className="text-[var(--dim)]" />
          <span className="text-[var(--dim)] tracking-widest uppercase">DOC</span>
          <span className="text-[var(--soft)] max-w-[160px] truncate">
            {docName ?? "—"}
          </span>
        </div>

        {/* Pipeline status */}
        <div className="flex items-center gap-2 px-4 border-r border-[var(--border)] flex-shrink-0">
          <Activity size={11} className="text-[var(--dim)]" />
          <span className="text-[var(--dim)] tracking-widest uppercase">STATUS</span>
          <span className={STEP_COLORS[pipelineStep]}>
            {STEP_LABELS[pipelineStep]}
          </span>
          {pipelineStep === 4 && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
          )}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 px-4 border-r border-[var(--border)] flex-shrink-0 min-w-[140px]">
          <Cpu size={11} className="text-[var(--dim)]" />
          <div className="flex-1 h-1 bg-[var(--muted)] rounded-full overflow-hidden min-w-[80px]">
            <div
              className="h-full bg-[var(--amber)] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(pipelineStep / 4) * 100}%` }}
            />
          </div>
          <span className="text-[var(--dim)]">{pipelineStep}/4</span>
        </div>

        {/* Messages */}
        <div className="flex items-center gap-2 px-4 flex-shrink-0">
          <MessageSquare size={11} className="text-[var(--dim)]" />
          <span className="text-[var(--dim)] tracking-widest uppercase">MSG</span>
          <span className="text-[var(--soft)]">{msgCount}</span>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="px-3 h-full flex items-center border-l border-[var(--border)]">
        <ThemeToggle />
      </div>
    </div>
  );
}
