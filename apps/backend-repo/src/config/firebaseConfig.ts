import * as dotenv from 'dotenv';
import * as FirebaseAdmin from 'firebase-admin';
import * as path from 'path';

dotenv.config(); 

try {
    const serviceAccountPathFromEnv = process.env.SERVICE_ACCOUNT_PATH;

    if (!serviceAccountPathFromEnv) {
        throw new Error(' not set in your .env file');
    }

    const absoluteServiceAccountPath = path.resolve(process.cwd(), serviceAccountPathFromEnv);
    const serviceAccount = require(absoluteServiceAccountPath);

    FirebaseAdmin.initializeApp({
        credential: FirebaseAdmin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');

} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error; 
}

export const firestore = FirebaseAdmin.firestore();
export const auth = FirebaseAdmin.auth();

export default FirebaseAdmin;