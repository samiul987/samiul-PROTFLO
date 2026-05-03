import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Higher-order function to wrap Firestore calls
async function wrapFirestore<T>(op: () => Promise<T>, type: OperationType, path: string): Promise<T> {
  try {
    return await op();
  } catch (error) {
    handleFirestoreError(error, type, path);
    throw error; // never reached due to throw in handleFirestoreError
  }
}

// --- Data Methods ---

export async function getCollection<T>(path: string, ...constraints: QueryConstraint[]): Promise<T[]> {
  return wrapFirestore(async () => {
    const q = query(collection(db, path), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
  }, OperationType.LIST, path);
}

export async function getDocument<T>(path: string, id: string): Promise<T | null> {
  return wrapFirestore(async () => {
    const snap = await getDoc(doc(db, path, id));
    return snap.exists() ? ({ ...snap.data(), id: snap.id } as T) : null;
  }, OperationType.GET, `${path}/${id}`);
}

export async function createDocument(path: string, id: string, data: DocumentData) {
  return wrapFirestore(async () => {
     const cleanData = {
       ...data,
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp()
     };
     await setDoc(doc(db, path, id), cleanData);
  }, OperationType.CREATE, `${path}/${id}`);
}

export async function updateDocument(path: string, id: string, data: DocumentData) {
  return wrapFirestore(async () => {
    const cleanData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(doc(db, path, id), cleanData);
  }, OperationType.UPDATE, `${path}/${id}`);
}

export async function deleteDocument(path: string, id: string) {
  return wrapFirestore(async () => {
    await deleteDoc(doc(db, path, id));
  }, OperationType.DELETE, `${path}/${id}`);
}

export function subscribeCollection<T>(path: string, callback: (data: T[]) => void, ...constraints: QueryConstraint[]) {
  const q = query(collection(db, path), ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[]);
  }, (error) => {
     handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeDocument<T>(path: string, id: string, callback: (data: T | null) => void) {
  return onSnapshot(doc(db, path, id), (snap) => {
    callback(snap.exists() ? ({ ...snap.data(), id: snap.id } as T) : null);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
  });
}
