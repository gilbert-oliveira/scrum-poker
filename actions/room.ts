"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// Re-defining interface here or importing shared types if we had a shared folder.
// For simplicity, we use the logic directly.

export async function createRoomAction(name: string, scaleType: string) {
  if (!name.trim()) {
    throw new Error("Room name is required");
  }

  const roomRef = await adminDb.collection("rooms").add({
    name,
    scaleType,
    status: "VOTING",
    createdAt: FieldValue.serverTimestamp(),
  });

  return roomRef.id;
}

export async function submitVoteAction(
  roomId: string,
  userId: string,
  userName: string,
  value: string
) {
  if (!roomId || !userId || !value) return;

  await adminDb
    .collection("rooms")
    .doc(roomId)
    .collection("votes")
    .doc(userId)
    .set({
      userId,
      userName,
      value,
      votedAt: FieldValue.serverTimestamp(),
    });
}

export async function revealVotesAction(roomId: string) {
  if (!roomId) return;
  await adminDb.collection("rooms").doc(roomId).update({
    status: "REVEALED",
  });
}

export async function resetRoundAction(roomId: string) {
  if (!roomId) return;

  // Option: actually clear votes?
  // Admin SDK allows us to list and delete easier.
  const votesRef = adminDb.collection("rooms").doc(roomId).collection("votes");
  const snapshot = await votesRef.get();

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.update(adminDb.collection("rooms").doc(roomId), {
    status: "VOTING",
  });

  await batch.commit();
}
