import { Source } from "@/lib/types";

interface Props {
  sources: Source[];
}

export default function SourcePills({ sources }: Props) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
      <span className="text-[9px] text-[var(--dim)] tracking-widest uppercase self-center mr-1">
        Sources
      </span>
      {sources.map((s, i) => (
        <span
          key={i}
          className="
            inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm
            bg-[var(--surface)] border border-[var(--border)]
            text-[10px] text-[var(--soft)] font-mono
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] flex-shrink-0" />
          Unit {s.unit_number ?? "?"} · {s.score.toFixed(2)}
        </span>
      ))}
    </div>
  );
}
