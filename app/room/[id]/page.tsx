"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useRoom } from "@/hooks/use-room";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PokerCard } from "@/components/room/poker-card";
import {
  submitVoteAction,
  revealVotesAction,
  resetRoundAction,
} from "@/actions/room";
import { subscribeToVotes, Vote } from "@/services/room";

// Next.js 15/16 params are async or promises in some contexts,
// strictly speaking params is a Promise in recent canary/rc versions of Next.js 15+ for async pages.
// But this is a client component, params are passed as props?
// In Next.js 13+ App Router, page props are { params: { id: '...' }, searchParams: ... }
// However, in very recent versions params might be a promise.
// Safest way for Client Component dealing with params is using `useParams` from `next/navigation`.
import { useParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams();
  const id = params?.id as string;
  // const router = useRouter();

  const { room, loading: roomLoading } = useRoom(id);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [userName, setUserName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [myUserId, setMyUserId] = useState("");

  // Checking local storage for user identity on mount
  useEffect(() => {
    const savedName = localStorage.getItem("scrum_poker_name");
    const savedId = localStorage.getItem("scrum_poker_id");

    if (savedName && savedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserName(savedName);
      setMyUserId(savedId);
      setIsJoined(true);
    }
  }, []); // Run once on mount

  // Subscribe to votes
  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToVotes(id, (data) => {
      setVotes(data);
    });
    return () => unsubscribe();
  }, [id]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    // Generate a simple ID if not relying on Auth yet
    const newUserId = crypto.randomUUID();

    // Save to local storage
    localStorage.setItem("scrum_poker_name", userName);
    localStorage.setItem("scrum_poker_id", newUserId);

    setMyUserId(newUserId);
    setIsJoined(true);

    // Call service (optional, if we track participants separately from votes)
    // await joinRoom(id, newUserId, userName);
  };

  const handleVote = async (value: string) => {
    if (!isJoined || !myUserId) return;
    await submitVoteAction(id, myUserId, userName, value);
  };

  const handleReveal = async () => {
    await revealVotesAction(id);
  };

  const handleReset = async () => {
    await resetRoundAction(id);
  };

  const handleLeave = () => {
    localStorage.removeItem("scrum_poker_name");
    localStorage.removeItem("scrum_poker_id");
    setIsJoined(false);
    setUserName("");
    // Ideally remove vote too
  };

  if (roomLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading room...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Room not found
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Join {room.name}
            </h2>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Your Name
                </label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                Join Session
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  const FIBONACCI = [
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
    "21",
    "34",
    "55",
    "89",
    "?",
  ];
  const currentVote = votes.find((v) => v.userId === myUserId)?.value;
  const isOwner = true; // TODO: Check actual ownership using room.ownerId matches local ID if we implemented that

  // Calculating stats
  const revealed = room.status === "REVEALED";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">{room.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Playing as{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {userName}
            </span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Leave
          </Button>
        </div>
      </header>

      {/* Main Table Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
        {/* Table Surface */}
        <div className="relative w-full max-w-4xl min-h-[400px] bg-slate-200 dark:bg-slate-800/50 rounded-full border-8 border-slate-300 dark:border-slate-700 flex items-center justify-center mb-12">
          {votes.length === 0 && (
            <div className="text-slate-500">Waiting for votes...</div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 p-12">
            {votes.map((vote) => (
              <div
                key={vote.userId}
                className="flex flex-col items-center gap-2"
              >
                <PokerCard
                  value={vote.value}
                  flipped={!revealed && vote.userId !== myUserId} // Flip if not revealed and not mine (mine is always visible to me? usually yes or maybe dimmed)
                  // Actually standard poker: everyone sees back of card until reveal.
                  // But useful to remember what I voted.
                  selected={revealed && vote.value === currentVote} // Highlight logic later
                  disabled
                  className={revealed ? "cursor-default" : "cursor-default"}
                />
                <span className="text-sm font-medium">{vote.userName}</span>
              </div>
            ))}
          </div>

          {/* Controls (Owner) */}
          {isOwner && (
            <div className="absolute -bottom-8 bg-white dark:bg-slate-900 px-6 py-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex gap-4">
              {revealed ? (
                <Button onClick={handleReset}>Start New Round</Button>
              ) : (
                <Button onClick={handleReveal} disabled={votes.length === 0}>
                  Reveal Cards
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Hand (Voting Deck) */}
      <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 p-6 pb-8 z-10">
        <div className="max-w-4xl mx-auto flex gap-4 overflow-x-auto pb-4 justify-center">
          {FIBONACCI.map((val) => (
            <PokerCard
              key={val}
              value={val}
              onClick={() => handleVote(val)}
              selected={currentVote === val}
              disabled={revealed}
              className="shrink-0"
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
