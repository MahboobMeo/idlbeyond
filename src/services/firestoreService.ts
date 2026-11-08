import {
  getFirestore,
  doc,
  setDoc,
  getDocFromServer,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { app, auth } from './googleAuth';
import firebaseConfig from '../../firebase-applet-config.json';

// CRITICAL: Initialize Firestore with the provisioned firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate Firestore connectivity on startup
 */
export async function testFirestoreConnection(): Promise<boolean> {
  const testPath = 'test/connection';
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status check - please check Firebase configuration.');
      return false;
    }
    // Expected if test document does not exist, but network handshake succeeded
    return true;
  }
}

/**
 * Save client consultation inquiry to Firestore
 */
export async function saveInquiryToFirestore(data: {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  budgetRange?: string;
  projectDetails: string;
}): Promise<string> {
  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const docPath = `inquiries/${inquiryId}`;

  try {
    await setDoc(doc(db, 'inquiries', inquiryId), {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      serviceType: data.serviceType,
      budgetRange: data.budgetRange || 'Rs. 19,999 (Launch Fixed Price)',
      projectDetails: data.projectDetails.trim(),
      status: 'new',
    });
    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

/**
 * Save student bootcamp seat registration to Firestore
 */
export async function saveBootcampRegistrationToFirestore(data: {
  name: string;
  email: string;
  phone: string;
  tuition?: string;
}): Promise<string> {
  const registrationId = `bootcamp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const docPath = `bootcampRegistrations/${registrationId}`;

  try {
    await setDoc(doc(db, 'bootcampRegistrations', registrationId), {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      tuition: data.tuition || 'Rs. 19,999 + GST',
      status: 'reserved',
    });
    return registrationId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

/**
 * Sync authenticated Google user profile to Firestore
 */
export async function syncUserProfileToFirestore(user: User): Promise<void> {
  if (!user.uid) return;
  const docPath = `users/${user.uid}`;

  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
