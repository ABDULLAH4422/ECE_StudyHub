/**
 * UpvoteButton — toggleable upvote control for the Note Detail page.
 *
 * - Only visible/active for logged-in users (checked via useRole).
 * - Optimistically updates the displayed count before the DB call resolves.
 * - Fetches the initial "has voted" state on mount.
 */
import React, { useEffect, useState } from "react";
import { ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/RoleContext";
import { toggleUpvote, hasUserUpvoted } from "@/services/notes";

interface UpvoteButtonProps {
  noteId: string;
  initialCount: number;
}

export function UpvoteButton({ noteId, initialCount }: UpvoteButtonProps) {
  const { currentUser } = useRole();

  // Local optimistic state
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);

  // Check whether this user already voted when the component mounts
  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const voted = await hasUserUpvoted(noteId, currentUser.id);
        if (!cancelled) setUpvoted(voted);
      } catch {
        // Non-fatal; default stays false
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, [noteId, currentUser.id]);

  const handleToggle = async () => {
    if (loading) return;

    // Optimistic update
    const wasUpvoted = upvoted;
    setUpvoted(!wasUpvoted);
    setCount((c) => wasUpvoted ? Math.max(0, c - 1) : c + 1);
    setLoading(true);

    try {
      const nowVoted = await toggleUpvote(noteId, currentUser.id);
      setUpvoted(nowVoted);
    } catch {
      // Revert on error
      setUpvoted(wasUpvoted);
      setCount((c) => wasUpvoted ? c + 1 : Math.max(0, c - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={upvoted ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className="gap-2"
      aria-label={upvoted ? "Remove upvote" : "Upvote this note"}
      title={upvoted ? "Click to remove your upvote" : "Click to upvote"}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <ThumbsUp className="w-4 h-4" />
      }
      <span>{count}</span>
      <span className="hidden sm:inline">{upvoted ? "Upvoted" : "Upvote"}</span>
    </Button>
  );
}
