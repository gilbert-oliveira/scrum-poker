import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

// Function to initialize the admin app
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Load service account from root directory
  const serviceAccountPath = path.join(process.cwd(), "service-account.json");

  try {
    // Use fs instead of require to avoid bundler trying to resolve the file at build time
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error(
      "Failed to load service-account.json. Please ensure it is in the project root.",
      error
    );
    throw new Error("Firebase Admin initialization failed");
  }
}

export const adminDb = getFirestore(getAdminApp());
