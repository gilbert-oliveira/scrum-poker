import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";

// Function to initialize the admin app
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Load service account from root directory
  const serviceAccountPath = path.join(process.cwd(), "service-account.json");

  try {
    // Ensure the file exists or handle error, but for now we assume it's there as per instructions.
    // We can't import strictly using 'require' if we want it to dynamic,
    // but usually we can just pass the path to cert if it was absolute,
    // actually cert() takes object or path.
    // However, in Next.js/Vercel environments, file reading can be tricky.
    // Standard approach for local/server:

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require(serviceAccountPath);

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
