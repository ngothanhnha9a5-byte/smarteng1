export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  coins: number;
  streak: number;
  lastActive: string;
  stats: {
    quizScore: number;
    grammarScore: number;
    speakingScore: number;
    writingScore: number;
    readingScore: number;
    listeningScore: number;
    battleWins: number;
  };
  totalScore: number;
  rank: "Bronze" | "Silver" | "Gold" | "Diamond";
  inventory: string[];
  role?: string;
}

export interface PublicProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  stats: {
    quizScore: number;
    grammarScore: number;
    speakingScore: number;
    writingScore: number;
    readingScore: number;
    listeningScore: number;
    battleWins: number;
  };
  totalScore: number;
  rank: "Bronze" | "Silver" | "Gold" | "Diamond";
}

export interface Question {
  id: string;
  module: "quiz" | "grammar" | "speaking" | "battle";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export type AppView = "dashboard" | "quiz" | "grammar" | "speaking" | "writing" | "reading" | "listening" | "battle" | "review" | "shop" | "leaderboard" | "profile" | "chat" | "knowledge";
