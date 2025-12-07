import { Link } from "react-router-dom";
import { ArrowRight, Clock, User, Bell, BellOff, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LegislativeAct } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { SubscriptionEmailDialog } from "@/components/SubscriptionEmailDialog";

interface ActCardProps {
  act: LegislativeAct;
}

function getProgressBadge(progress: string) {
  switch (progress) {
    case "przyjety":
      return <Badge className="bg-status-accepted text-white">Przyjęty</Badge>;
    case "w_toku":
      return <Badge className="bg-status-in-progress text-white">W toku</Badge>;
    case "archiwalny":
      return <Badge className="bg-status-archived text-white">Archiwalny</Badge>;
    default:
      return null;
  }
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; className: string }> = {
    planowany: { label: "Planowany", className: "bg-blue-100 text-blue-800" },
    procedowany: { label: "Procedowany", className: "bg-yellow-100 text-yellow-800" },
    uchwalony: { label: "Uchwalony", className: "bg-green-100 text-green-800" },
    odrzucony: { label: "Odrzucony", className: "bg-red-100 text-red-800" },
    wycofany: { label: "Wycofany", className: "bg-gray-100 text-gray-800" },
  };

  const info = statusMap[status];
  return info ? <Badge className={info.className}>{info.label}</Badge> : null;
}

export function ActCard({ act }: ActCardProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!subscribed) {
      setDialogOpen(true);
    } else {
      setSubscribed(false);
      toast.info("Anulowano subskrypcję aktu");
    }
  };

  const handleEmailSubscribe = async (email: string) => {
    // Here you would typically make an API call to subscribe
    // For now, we'll just simulate it
    setSubscribed(true);
    console.log(`Subscribed to act "${act.title}" with email: ${email}`);
  };

  const safeStages = Array.isArray(act.stages) ? act.stages : [];
  const currentStage = safeStages.find((s) => s.status === "in_progress") || safeStages[safeStages.length - 1];

  return (
    <>
      <div className="gov-card group hover:shadow-md transition-all duration-200 hover:border-primary/30">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {getProgressBadge(act.progress)}
            {getStatusBadge(act.status)}
            {act.priority === "high" && (
              <Badge variant="outline" className="border-accent text-accent">
                Priorytet
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${subscribed ? "text-accent" : "text-muted-foreground"} hover:text-accent`}
            onClick={handleSubscribe}
            aria-label={subscribed ? "Anuluj subskrypcję" : "Subskrybuj akt"}
          >
            {subscribed ? <Bell className="h-5 w-5 fill-current" /> : <BellOff className="h-5 w-5" />}
          </Button>
        </div>

        <Link to={`/akt/${act.id}`} className="block">
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {act.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{act.summary}</p>

          {/* Current stage */}
          <div className="bg-secondary/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Aktualny etap:</p>
            <p className="text-sm font-medium text-foreground">{currentStage?.name}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {Array.isArray(act.tags) && act.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                <Tag className="h-3 w-3" />
                {typeof tag === 'string' ? tag.replace(/_/g, " ") : String(tag)}
              </span>
            ))}
            {Array.isArray(act.tags) && act.tags.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">+{act.tags.length - 3}</span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {act.sponsor}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {act.lastUpdated}
              </span>
            </div>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Szczegóły
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>
      
      <SubscriptionEmailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubscribe={handleEmailSubscribe}
        title={`Subskrybuj akt: ${act.title}`}
        description="Wpisz swój email, aby otrzymywać powiadomienia o zmianach w tym akcie"
      />
    </>
  );
}
