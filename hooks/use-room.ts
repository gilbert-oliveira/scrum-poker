import { useEffect, useState } from "react";
import { Room, subscribeToRoom } from "@/services/room";

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { room, loading };
}
