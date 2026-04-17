"use client";

import { CheckCircle2, Circle, Loader2, Lock } from "lucide-react";
import clsx from "clsx";

type StepStatus = "idle" | "active" | "loading" | "done" | "locked";

interface Props {
  number:   number;
  label:    string;
  sublabel: string;
  status:   StepStatus;
  onClick?: () => void;
}

export default function PipelineStep({ number, label, sublabel, status, onClick }: Props) {
  const isClickable = status === "active";

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={clsx(
        "group relative flex items-start gap-3 p-3 rounded border transition-all duration-200",
        {
          "border-[var(--border)]   bg-[var(--surface)]    cursor-default  opacity-40":                 status === "locked",
          "border-[var(--border)]   bg-[var(--surface)]    cursor-default  opacity-60":                 status === "idle",
          "border-[var(--amber)]    bg-[var(--amber-glow)] cursor-pointer  amber-glow-sm":              status === "active",
          "border-[var(--border)]   bg-[var(--surface)]    cursor-default  opacity-50":                 status === "loading",
          "border-[var(--green)]    bg-[rgba(61,214,140,0.06)] cursor-default":                         status === "done",
        }
      )}
    >
      {/* Step number */}
      <div className={clsx(
        "flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-xs font-display tracking-wider",
        {
          "bg-[var(--muted)] text-[var(--dim)]":   status !== "active" && status !== "done",
          "bg-[var(--amber)] text-[var(--bg)]":    status === "active",
          "bg-[var(--green)] text-[var(--bg)]":    status === "done",
        }
      )}>
        {number}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className={clsx("text-xs font-mono font-medium tracking-widest uppercase", {
          "text-[var(--amber)]":  status === "active",
          "text-[var(--green)]":  status === "done",
          "text-[var(--soft)]":   status === "idle" || status === "loading",
          "text-[var(--muted)]":  status === "locked",
        })}>
          {label}
        </div>
        <div className="text-[10px] text-[var(--dim)] mt-0.5 font-mono">{sublabel}</div>
      </div>

      {/* Status icon */}
      <div className="flex-shrink-0 mt-0.5">
        {status === "done"    && <CheckCircle2 size={14} className="text-[var(--green)]" />}
        {status === "loading" && <Loader2      size={14} className="text-[var(--amber)] animate-spin" />}
        {status === "locked"  && <Lock         size={12} className="text-[var(--muted)]" />}
        {status === "active"  && (
          <div className="w-2 h-2 rounded-full bg-[var(--amber)] animate-pulse mt-0.5" />
        )}
      </div>

      {/* Click hint */}
      {status === "active" && (
        <div className="absolute inset-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--amber-glow)]">
          <span className="text-[10px] text-amber font-mono tracking-widest uppercase">Click to run →</span>
        </div>
      )}
    </div>
  );
}
