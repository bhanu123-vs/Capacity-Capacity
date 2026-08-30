import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { UserProfile, UserRole } from '../types';

// The user-provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDstYTrrLeWlnYY3q80Wc1t1w2pd1LkQnY",
  authDomain: "capacity-connect-f929b.firebaseapp.com",
  projectId: "capacity-connect-f929b",
  storageBucket: "capacity-connect-f929b.firebasestorage.app",
  messagingSenderId: "179758871640",
  appId: "1:179758871640:web:f81df0c7382dc2216dc62d",
  measurementId: "G-ECTTGS9N1S"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally
let analyticsInstance: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analyticsInstance = getAnalytics(app);
      } catch (err) {
        console.warn("Firebase Analytics could not be initialized:", err);
      }
    }
  });
}
export const analytics = analyticsInstance;

// Operation Types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Stores or updates a user profile document in Cloud Firestore under users/{uid}
 * Specifically persists the user's role (Trainee, Trainer, Admin).
 */
export async function saveUserProfileToFirestore(uid: string, profile: Partial<UserProfile> & { role: UserRole }) {
  const userRef = doc(db, 'users', uid);
  const dataToSave = {
    uid,
    name: profile.name || 'Meteorological Officer',
    email: profile.email || '',
    role: profile.role, // 'Trainee' | 'Trainer' | 'Admin'
    department: profile.department || 'India Meteorological Department (IMD)',
    designation: profile.designation || (profile.role === 'Admin' ? 'Central Director' : profile.role === 'Trainer' ? 'Senior Faculty' : 'Trainee Meteorologist'),
    employeeId: profile.employeeId || `MOES-${profile.role.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
    centerLocation: profile.centerLocation || 'HQ Mausam Bhavan, New Delhi',
    bio: profile.bio || `Registered ${profile.role} at Ministry of Earth Sciences`,
    avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || uid)}`,
    status: profile.status || 'Active',
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(userRef, dataToSave, { merge: true });
    return dataToSave;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    throw error;
  }
}

/**
 * Retrieves the user profile from Cloud Firestore under users/{uid}
 */
export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

/**
 * Test connectivity to Firestore
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDoc = await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or network restricted.");
    }
    return false;
  }
}
