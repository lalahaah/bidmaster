import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  DocumentReference,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  UserDocument,
  BidNotice,
  CompanyProfile,
  NotificationSettings,
  BidFilterOptions,
} from '@/types'

// ─── 사용자 문서 ─────────────────────────────────────────────

export async function getUserDoc(uid: string): Promise<UserDocument | null> {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as UserDocument
}

export async function createUserDoc(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null
): Promise<void> {
  const ref = doc(db, 'users', uid)
  const now = Timestamp.now()

  const defaultUser: Omit<UserDocument, 'uid'> = {
    email,
    displayName,
    photoURL,
    profile: {
      bizCodes: [],
      licenses: [],
      revenue: 0,
      headcount: 0,
      region: '',
    },
    settings: {
      kakaoPhone: '',
      scoreThreshold: 70,
      notifyEnabled: false,
    },
    subscription: {
      plan: 'free',
      trialEndsAt: null,
      paidUntil: null,
    },
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(ref, defaultUser)
}

export async function updateUserProfile(
  uid: string,
  profile: Partial<CompanyProfile>
): Promise<void> {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    ...Object.fromEntries(
      Object.entries(profile).map(([k, v]) => [`profile.${k}`, v])
    ),
    updatedAt: Timestamp.now(),
  })
}

export async function updateNotificationSettings(
  uid: string,
  settings: Partial<NotificationSettings>
): Promise<void> {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    ...Object.fromEntries(
      Object.entries(settings).map(([k, v]) => [`settings.${k}`, v])
    ),
    updatedAt: Timestamp.now(),
  })
}

// ─── 입찰 공고 ───────────────────────────────────────────────

export async function getBidNotices(
  filters: BidFilterOptions = {},
  pageLimit = 20
): Promise<BidNotice[]> {
  const ref = collection(db, 'bid_notices')
  const constraints: Parameters<typeof query>[1][] = []

  if (filters.matchStatus) {
    constraints.push(where('matchStatus', '==', filters.matchStatus))
  }
  if (filters.minScore !== undefined) {
    constraints.push(where('aiSummary.score', '>=', filters.minScore))
  }

  constraints.push(orderBy('createdAt', 'desc'))
  constraints.push(limit(pageLimit))

  const q = query(ref, ...constraints)
  const snap = await getDocs(q)

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BidNotice))
}

export async function getBidNoticeById(id: string): Promise<BidNotice | null> {
  const ref = doc(db, 'bid_notices', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as BidNotice
}

export async function saveBidNotice(
  id: string,
  data: Omit<BidNotice, 'id'>
): Promise<void> {
  const ref = doc(db, 'bid_notices', id) as DocumentReference
  await setDoc(ref, data)
}

export async function updateMatchStatus(
  id: string,
  matchStatus: BidNotice['matchStatus'],
  extra?: Record<string, unknown>
): Promise<void> {
  const ref = doc(db, 'bid_notices', id)
  await updateDoc(ref, { matchStatus, ...extra })
}
