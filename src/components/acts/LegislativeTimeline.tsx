import { Check, Clock, Circle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useState } from "react";

interface Stage {
  id: string;
  name: string;
  date: string | null;
  status: "done" | "in_progress" | "pending";
  description?: string;
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
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const toggleStage = (stageId: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  return (
    <div className={cn("relative", compact ? "space-y-2" : "space-y-6")}>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandHeight {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        @keyframes lineGrow {
          from {
            height: 0;
          }
          to {
            height: var(--line-height, 60px);
          }
        }

        .timeline-stage {
          animation: slideDown 0.5s ease-out forwards;
        }

        .timeline-stage:nth-child(1) { animation-delay: 0s; }
        .timeline-stage:nth-child(2) { animation-delay: 0.1s; }
        .timeline-stage:nth-child(3) { animation-delay: 0.2s; }
        .timeline-stage:nth-child(4) { animation-delay: 0.3s; }
        .timeline-stage:nth-child(5) { animation-delay: 0.4s; }
        .timeline-stage:nth-child(n+6) { animation-delay: 0.5s; }

        .timeline-connector {
          animation: lineGrow 0.6s ease-out forwards;
          transform-origin: top;
        }

        .timeline-connector:nth-child(odd) { animation-delay: 0.1s; }
        .timeline-connector:nth-child(even) { animation-delay: 0.2s; }

        .stage-details {
          animation: expandHeight 0.3s ease-out forwards;
          overflow: hidden;
        }

        .stage-icon {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>

      {stages.map((stage, index) => (
        <div key={stage.id} className="timeline-stage relative">
          <div className="flex gap-4">
            {/* Left column with icon and connector */}
            <div className="relative flex flex-col items-center">
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div
                  className="timeline-connector absolute top-12 w-0.5 bg-gradient-to-b"
                  style={{
                    background:
                      stage.status === "done"
                        ? "linear-gradient(to bottom, hsl(142, 76%, 36%), hsl(142, 76%, 36%))"
                        : "linear-gradient(to bottom, hsl(217, 32%, 17%), hsl(217, 32%, 17%))",
                    height: compact ? "24px" : "60px",
                  }}
                />
              )}

              {/* Status icon */}
              <div
                className={cn(
                  "stage-icon shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-300",
                  "border-2",
                  stage.status === "done" &&
                    "bg-status-accepted text-white border-status-accepted shadow-status-accepted/50",
                  stage.status === "in_progress" &&
                    "bg-status-in-progress text-white border-status-in-progress shadow-status-in-progress/50 animate-pulse scale-110",
                  stage.status === "pending" &&
                    "bg-background text-muted-foreground border-border hover:border-primary/50 hover:shadow-primary/20"
                )}
              >
                {stage.status === "done" && (
                  <Check className="h-5 w-5" strokeWidth={3} />
                )}
                {stage.status === "in_progress" && (
                  <Clock className="h-5 w-5" strokeWidth={3} />
                )}
                {stage.status === "pending" && (
                  <Circle className="h-4 w-4" strokeWidth={2} />
                )}
              </div>
            </div>

            {/* Right column with content */}
            <div className="flex-1 pb-4">
              <button
                onClick={() => toggleStage(stage.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-300",
                  "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  stage.status === "done" && "bg-status-accepted/5 border border-status-accepted/20",
                  stage.status === "in_progress" &&
                    "bg-status-in-progress/5 border border-status-in-progress/30 shadow-sm",
                  stage.status === "pending" && "bg-muted/30 border border-border/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-semibold transition-colors",
                        stage.status === "done" && "text-status-accepted",
                        stage.status === "in_progress" && "text-status-in-progress",
                        stage.status === "pending" && "text-muted-foreground",
                        compact ? "text-sm" : "text-base"
                      )}
                    >
                      {stage.name}
                    </p>
                    {stage.date && (
                      <p className={cn("text-muted-foreground mt-1", compact ? "text-xs" : "text-sm")}>
                        {formatDate(stage.date)}
                      </p>
                    )}
                  </div>
                  {stage.description && (
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-300 shrink-0 mt-1",
                        expandedStages.has(stage.id) && "rotate-180"
                      )}
                    />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {stage.description && expandedStages.has(stage.id) && (
                <div className="stage-details mt-2 ml-2 pl-3 border-l-2 border-primary/30">
                  <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
