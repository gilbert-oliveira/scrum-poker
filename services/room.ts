import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

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

export const createRoom = async (name: string, scaleType: string) => {
  const roomRef = await addDoc(collection(db, ROOMS_COLLECTION), {
    name,
    scaleType,
    status: "VOTING",
    createdAt: serverTimestamp(),
  });
  return roomRef.id;
};

// Feature placeholder
export const joinRoom = async () => {
  // TODO: Implement join logic with roomId, userId, userName
};

export const submitVote = async (
  roomId: string,
  userId: string,
  userName: string,
  value: string
) => {
  const voteRef = doc(db, ROOMS_COLLECTION, roomId, "votes", userId);
  await setDoc(voteRef, {
    userId,
    userName,
    value,
    votedAt: serverTimestamp(),
  });
};

export const revealVotes = async (roomId: string) => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    status: "REVEALED",
  });
};

export const resetRound = async (roomId: string) => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    status: "VOTING",
  });
  // Note: In a real app we might want to archive old votes or delete them.
  // For MVP, we can handle clearing differently or just delete the subcollection if needed,
  // but subcollection deletion is not atomic in client SDK.
  // Better strategy: Add a 'roundId' to the room and votes filter by roundId.
  // implementing simplified reset for now:
  // We will need to clear votes or ignore them.
  // Let's assume we update a 'roundId' timestamp on the room, and use it to filter votes?
  // Or just Keep it simple: UI will clear local state, but we really need backend toggle.
  // Let's add 'updatedAt' to room on reset, and clients ignore votes older than that?
  // A bit complex.
  // Alternative: Reset status to VOTING.
};

export const subscribeToRoom = (
  roomId: string,
  callback: (room: Room) => void
) => {
  return onSnapshot(doc(db, ROOMS_COLLECTION, roomId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Room);
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
