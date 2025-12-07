import { Check, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface Stage {
  id: string;
  name: string;
  date: string | null;
  status: "done" | "in_progress" | "pending";
}

interface LegislativeTimelineProps {
  stages: Stage[];
  compact?: boolean;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy, HH:mm", { locale: pl });
  } catch {
    return dateString;
  }
};

export function LegislativeTimeline({ stages, compact = false }: LegislativeTimelineProps) {
  return (
    <div className={cn("relative", compact ? "space-y-2" : "space-y-4")}>
      {stages.map((stage, index) => (
        <div key={stage.id} className="relative flex items-start gap-4">
          {/* Connector line */}
          {index < stages.length - 1 && (
            <div
              className={cn(
                "absolute left-4 top-8 w-0.5 -translate-x-1/2",
                compact ? "h-6" : "h-10",
                stage.status === "done" ? "bg-status-accepted" : "bg-border"
              )}
            />
          )}

          {/* Status icon */}
          <div
            className={cn(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10",
              stage.status === "done" && "bg-status-accepted text-white",
              stage.status === "in_progress" && "bg-status-in-progress text-white animate-pulse",
              stage.status === "pending" && "bg-muted border-2 border-border text-muted-foreground"
            )}
          >
            {stage.status === "done" && <Check className="h-4 w-4" />}
            {stage.status === "in_progress" && <Clock className="h-4 w-4" />}
            {stage.status === "pending" && <Circle className="h-3 w-3" />}
          </div>

          {/* Content */}
          <div className={cn("flex-1 pb-2", compact ? "min-h-[32px]" : "min-h-[48px]")}>
            <p
              className={cn(
                "font-medium",
                stage.status === "done" && "text-foreground",
                stage.status === "in_progress" && "text-primary font-semibold",
                stage.status === "pending" && "text-muted-foreground",
                compact ? "text-sm" : "text-base"
              )}
            >
              {stage.name}
            </p>
            {stage.date && (
              <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
                {formatDate(stage.date)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
