"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRoomAction } from "@/actions/room";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      // Default to FIBONACCI for now.
      const roomId = await createRoomAction(roomName, "FIBONACCI");
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-indigo-600 dark:text-indigo-400">
            Scrum Poker
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Simple, realtime estimation for agile teams.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create a Room</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="roomName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Room Name
                </label>
                <Input
                  id="roomName"
                  placeholder="e.g. Daily Standup or Planning"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !roomName.trim()}
              >
                {loading ? "Creating..." : "Start Session"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500">
          <p>No login required. Just share the link.</p>
        </div>
      </div>
    </main>
  );
}
