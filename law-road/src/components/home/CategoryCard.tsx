import { Link } from "react-router-dom";
import { Bell, BellOff, Banknote, Scale, Shield, GraduationCap, Heart, Leaf, Train, Building2, Wheat, Monitor, Palette, Landmark, FileText, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const iconMap: Record<string, LucideIcon> = {
  Banknote, Scale, Shield, GraduationCap, Heart, Leaf, Train, Building2, Wheat, Monitor, Palette, Landmark, FileText
};

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function CategoryCard({ id, name, icon, count }: CategoryCardProps) {
  const [subscribed, setSubscribed] = useState(false);

  const IconComponent = iconMap[icon] || FileText;

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSubscribed(!subscribed);
    if (!subscribed) {
      toast.success(`Zasubskrybowano kategorię "${name}"`, {
        description: "Będziesz otrzymywać powiadomienia o nowych aktach.",
      });
    } else {
      toast.info(`Anulowano subskrypcję kategorii "${name}"`);
    }
  };

  return (
    <div className="gov-card group hover:shadow-md transition-all duration-200 hover:border-primary/30">
      <Link to={`/kategoria/${id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <IconComponent className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 ${subscribed ? "text-accent" : "text-muted-foreground"} hover:text-accent`}
            onClick={handleSubscribe}
            aria-label={subscribed ? "Anuluj subskrypcję" : "Subskrybuj kategorię"}
          >
            {subscribed ? <Bell className="h-5 w-5 fill-current" /> : <BellOff className="h-5 w-5" />}
          </Button>
        </div>
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "akt" : count < 5 ? "akty" : "aktów"} w procedowaniu
        </p>
      </Link>
    </div>
  );
}
