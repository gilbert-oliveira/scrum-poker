import { db } from "@/lib/firebase/config";
import { collection, doc, onSnapshot } from "firebase/firestore";

export interface Room {
  id: string;
  name: string;
  scaleType: "FIBONACCI" | "TSHIRT" | "CUSTOM";
  status: "VOTING" | "REVEALED";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  ownerId?: string; // Optional for now
}

export interface Vote {
  userId: string;
  userName: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votedAt: any;
}

const ROOMS_COLLECTION = "rooms";

// Feature placeholder
export const joinRoom = async () => {
  // TODO: Implement join logic with roomId, userId, userName
};

// Write operations moved to actions/room.ts (Server Actions)

export const subscribeToRoom = (
  roomId: string,
  callback: (room: Room | null) => void
) => {
  return onSnapshot(doc(db, ROOMS_COLLECTION, roomId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Room);
    } else {
      callback(null);
    }
  });
};

export const subscribeToVotes = (
  roomId: string,
  callback: (votes: Vote[]) => void
) => {
  return onSnapshot(
    collection(db, ROOMS_COLLECTION, roomId, "votes"),
    (snapshot) => {
      const votes = snapshot.docs.map((d) => d.data() as Vote);
      callback(votes);
    }
  );
};
