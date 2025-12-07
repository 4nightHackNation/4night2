import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SubscriptionEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: (email: string) => void;
  title?: string;
  description?: string;
}

export function SubscriptionEmailDialog({
  open,
  onOpenChange,
  onSubscribe,
  title = "Subskrybuj",
  description = "Wpisz swój email, aby otrzymywać powiadomienia"
}: SubscriptionEmailDialogProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes("@")) {
      toast.error("Wpisz poprawny adres email");
      return;
    }

    setIsLoading(true);
    try {
      // Call the subscription handler
      await onSubscribe(email);
      setEmail("");
      onOpenChange(false);
      toast.success("Zasubskrybowano pomyślnie", {
        description: `Potwierdzenie zostało wysłane na ${email}`,
      });
    } catch (error) {
      toast.error("Błąd podczas subskrypcji");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setEmail("");
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Twój email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Wysyłanie..." : "Subskrybuj"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
