import { useState } from "react";
import { MessageCircle, Send, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

export interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  authorRole: "citizen" | "officer" | "admin";
  content: string;
  createdAt: string;
  approved: boolean;
}

interface CommentsProps {
  actId: string;
  hasConsultation: boolean;
  consultationEnd?: string;
  onCommentAdded?: (comment: Comment) => void;
}

export function ActComments({
  actId,
  hasConsultation,
  consultationEnd,
  onCommentAdded,
}: CommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Anna Kowalska",
      authorEmail: "anna@example.com",
      authorRole: "citizen",
      content: "Uważam, że projekt powinien zawierać więcej zapisów o ochronie konsumentów.",
      createdAt: "2025-06-01T10:30:00",
      approved: true,
    },
    {
      id: "c2",
      author: "Piotr Nowak",
      authorEmail: "piotr@example.com",
      authorRole: "citizen",
      content: "Zgadzam się z poprzednią opinią. Oprócz tego sugeruję weryfikację procedur.",
      createdAt: "2025-06-02T14:15:00",
      approved: true,
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const isConsultationActive =
    hasConsultation &&
    consultationEnd &&
    new Date(consultationEnd) > new Date();

  const handleAddComment = async () => {
    if (!isAuthenticated || user?.role !== "citizen") {
      toast.error("Tylko obywatele mogą dodawać komentarze");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Komentarz nie może być pusty");
      return;
    }

    if (!isConsultationActive) {
      toast.error("Konsultacje publiczne już się zakończyły");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        author: user.name,
        authorEmail: user.email,
        authorRole: "citizen",
        content: newComment,
        createdAt: new Date().toISOString(),
        approved: false,
      };

      setComments([...comments, comment]);
      setNewComment("");
      setLoading(false);

      toast.success("Komentarz został dodany", {
        description: "Oczekuje na akceptację przez administratora",
      });

      onCommentAdded?.(comment);
    }, 500);
  };

  const handleApproveComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, approved: true } : c
      )
    );
    toast.success("Komentarz zaakceptowany");
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
    toast.success("Komentarz usunięty");
  };

  const approvedComments = comments.filter((c) => c.approved);
  const pendingComments = comments.filter((c) => !c.approved);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Konsultacje publiczne
          {hasConsultation && (
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              Do: {consultationEnd}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add comment section */}
        {isAuthenticated && user?.role === "citizen" && isConsultationActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Dodaj swoją opinię</h3>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tutaj możesz podzielić się swoją opinią na temat projektu..."
              className="min-h-24 mb-3"
            />
            <Button
              onClick={handleAddComment}
              disabled={loading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Wysyłanie..." : "Wyślij opinię"}
            </Button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Aby dodać komentarz, musisz być zalogowany jako obywatel
            </p>
          </div>
        )}

        {isAuthenticated && user?.role !== "citizen" && (
          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Tylko obywatele mogą dodawać komentarze
            </p>
          </div>
        )}

        {!isConsultationActive && hasConsultation && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Okres konsultacji publicznych zakończył się
            </p>
          </div>
        )}

        {/* Officer/Admin pending review section */}
        {(user?.role === "officer" || user?.role === "admin") &&
          pendingComments.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium mb-3 text-sm">
                Opinie oczekujące na akceptację ({pendingComments.length})
              </h3>
              <div className="space-y-3">
                {pendingComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white p-3 rounded border border-yellow-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(comment.createdAt),
                            { locale: pl, addSuffix: true }
                          )}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                        Oczekuje
                      </span>
                    </div>
                    <p className="text-sm mb-3">{comment.content}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveComment(comment.id)}
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Zaakceptuj
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Usuń
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Approved comments */}
        {approvedComments.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">
              Opinie ({approvedComments.length})
            </h3>
            <div className="space-y-4">
              {approvedComments
                .filter((comment) => {
                  // Obywatele widzą tylko własne komentarze
                  if (user?.role === "citizen") {
                    return comment.authorEmail === user.email;
                  }
                  // Urzędnicy i admini widzą wszystkie
                  return true;
                })
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(comment.createdAt),
                            { locale: pl, addSuffix: true }
                          )}
                        </p>
                      </div>
                      {(user?.role === "officer" ||
                        user?.role === "admin") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteComment(comment.id)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
            </div>
            {user?.role === "citizen" && approvedComments.filter((c) => c.authorEmail === user.email).length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  Nie masz jeszcze żadnych zatwierdzonych opinii
                </p>
              </div>
            )}
          </div>
        )}

        {approvedComments.length === 0 && pendingComments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Brak opinii na ten temat
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
