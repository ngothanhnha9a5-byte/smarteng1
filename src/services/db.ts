import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  arrayUnion,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { UserProfile, Question, PublicProfile } from "../types";
import { shuffleArray } from "../lib/utils";

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
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
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(user: any): Promise<UserProfile> {
  const newUser: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || "Học sinh",
    email: user.email,
    photoURL: user.photoURL,
    coins: 100,
    streak: 0,
    lastActive: new Date().toISOString(),
    stats: {
      quizScore: 0,
      grammarScore: 0,
      speakingScore: 0,
      writingScore: 0,
      readingScore: 0,
      listeningScore: 0,
      battleWins: 0
    },
    rank: "Bronze",
    totalScore: 0,
    inventory: []
  };

  const publicProfile: PublicProfile = {
    uid: user.uid,
    displayName: newUser.displayName,
    photoURL: newUser.photoURL,
    stats: newUser.stats,
    totalScore: newUser.totalScore,
    rank: newUser.rank
  };

  const batch = writeBatch(db);
  batch.set(doc(db, "users", user.uid), newUser);
  batch.set(doc(db, "profiles", user.uid), publicProfile);

  try {
    await batch.commit();
    return newUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "users/profiles batch");
    throw error;
  }
}

export async function updateScore(uid: string, module: string, score: number) {
  const userRef = doc(db, "users", uid);
  const profileRef = doc(db, "profiles", uid);
  
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap.data() as UserProfile;
    
    // Streak Logic
    const now = new Date();
    const lastActive = new Date(userData.lastActive);
    
    const isYesterday = (date: Date) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date.getDate() === yesterday.getDate() &&
             date.getMonth() === yesterday.getMonth() &&
             date.getFullYear() === yesterday.getFullYear();
    };

    const isToday = (date: Date) => {
      return date.getDate() === now.getDate() &&
             date.getMonth() === now.getMonth() &&
             date.getFullYear() === now.getFullYear();
    };

    let newStreak = userData.streak;
    if (isYesterday(lastActive)) {
      newStreak += 1;
    } else if (!isToday(lastActive)) {
      newStreak = 1;
    }

    const field = `stats.${module}Score`;
    const batch = writeBatch(db);
    
    const updates = {
      [field]: increment(score),
      totalScore: increment(score),
      coins: increment(Math.floor(score / 10)),
      streak: newStreak,
      lastActive: now.toISOString()
    };

    const profileUpdates = {
      [field]: increment(score),
      totalScore: increment(score)
    };

    batch.update(userRef, updates);
    batch.update(profileRef, profileUpdates);
    
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function incrementBattleWin(uid: string) {
  const userRef = doc(db, "users", uid);
  const profileRef = doc(db, "profiles", uid);
  
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap.data() as UserProfile;

    const now = new Date();
    const lastActive = new Date(userData.lastActive);
    
    const isYesterday = (date: Date) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date.getDate() === yesterday.getDate() &&
             date.getMonth() === yesterday.getMonth() &&
             date.getFullYear() === yesterday.getFullYear();
    };

    const isToday = (date: Date) => {
      return date.getDate() === now.getDate() &&
             date.getMonth() === now.getMonth() &&
             date.getFullYear() === now.getFullYear();
    };

    let newStreak = userData.streak;
    if (isYesterday(lastActive)) {
      newStreak += 1;
    } else if (!isToday(lastActive)) {
      newStreak = 1;
    }

    const batch = writeBatch(db);
    batch.update(userRef, {
      "stats.battleWins": increment(1),
      totalScore: increment(100),
      coins: increment(50),
      streak: newStreak,
      lastActive: now.toISOString()
    });
    batch.update(profileRef, {
      "stats.battleWins": increment(1),
      totalScore: increment(100)
    });
    
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function getQuestions(module: string, difficulty: string): Promise<Question[]> {
  const path = "questions";
  try {
    const q = query(
      collection(db, "questions"), 
      where("module", "==", module),
      where("difficulty", "==", difficulty),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    return shuffleArray(questions).slice(0, 10);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToTopUsers(sortBy: string, limitCount: number, callback: (users: PublicProfile[]) => void) {
  const path = "profiles";
  const q = query(
    collection(db, "profiles"),
    orderBy(sortBy, "desc"),
    limit(limitCount)
  );
  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map(doc => doc.data() as PublicProfile);
    callback(users);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function checkStreakOnLogin(uid: string) {
  const userRef = doc(db, "users", uid);
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap.data() as UserProfile;

    const now = new Date();
    const lastActive = new Date(userData.lastActive);
    
    const isYesterday = (date: Date) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date.getDate() === yesterday.getDate() &&
             date.getMonth() === yesterday.getMonth() &&
             date.getFullYear() === yesterday.getFullYear();
    };

    const isToday = (date: Date) => {
      return date.getDate() === now.getDate() &&
             date.getMonth() === now.getMonth() &&
             date.getFullYear() === now.getFullYear();
    };

    if (!isToday(lastActive) && !isYesterday(lastActive)) {
      await updateDoc(userRef, {
        streak: 0
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function buyItem(uid: string, itemId: string, price: number) {
  const userRef = doc(db, "users", uid);
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return false;
    const userData = userSnap.data() as UserProfile;

    if (userData.coins < price) return false;
    if (userData.inventory.includes(itemId)) return false;

    await updateDoc(userRef, {
      coins: increment(-price),
      inventory: arrayUnion(itemId)
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    return false;
  }
}

export async function getCurriculum(grade: number): Promise<any[]> {
  const path = "curriculum";
  try {
    const q = query(
      collection(db, "curriculum"),
      where("grade", "==", grade),
      orderBy("unit", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveCurriculumUnit(grade: number, unitData: any) {
  const curriculumId = `grade${grade}_unit${unitData.unit}`;
  const path = `curriculum/${curriculumId}`;
  try {
    await setDoc(doc(db, "curriculum", curriculumId), {
      ...unitData,
      grade,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveQuestions(questions: any[]) {
  const path = "questions";
  try {
    const batch = writeBatch(db);
    questions.forEach(q => {
      const qRef = doc(collection(db, "questions"));
      batch.set(qRef, {
        ...q,
        createdAt: new Date().toISOString()
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function equipItem(uid: string, itemUrl: string) {
  const userRef = doc(db, "users", uid);
  const profileRef = doc(db, "profiles", uid);
  try {
    const batch = writeBatch(db);
    batch.update(userRef, { photoURL: itemUrl });
    batch.update(profileRef, { photoURL: itemUrl });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

