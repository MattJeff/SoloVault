// Gamification system for SoloVault

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProgress {
  email: string;
  points: number;
  badges: string[];
  level: number;
  actions: {
    emailSubmitted: boolean;
    quizCompleted: boolean;
    projectsViewed: number;
    dataDownloaded: boolean;
    referrals: number;
  };
  createdAt: string;
  lastActivity: string;
}

export const BADGES: Badge[] = [
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Parmi les 100 premiers inscrits',
    icon: '🌟',
    points: 100,
    rarity: 'legendary'
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'A complété le quiz SaaS',
    icon: '🎯',
    points: 50,
    rarity: 'common'
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'A consulté 10+ projets',
    icon: '🔍',
    points: 30,
    rarity: 'common'
  },
  {
    id: 'data_collector',
    name: 'Data Collector',
    description: 'A téléchargé la base de données',
    icon: '📊',
    points: 200,
    rarity: 'epic'
  },
  {
    id: 'power_user',
    name: 'Power User',
    description: 'A consulté 50+ projets',
    icon: '⚡',
    points: 100,
    rarity: 'rare'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'A parrainé 3+ personnes',
    icon: '👑',
    points: 150,
    rarity: 'epic'
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Première inscription',
    icon: '🚀',
    points: 10,
    rarity: 'common'
  },
  {
    id: 'calculator_user',
    name: 'Calculator Pro',
    description: 'A utilisé le calculateur de revenue',
    icon: '💰',
    points: 25,
    rarity: 'common'
  }
];

export const ACTIONS_POINTS = {
  EMAIL_SUBMIT: 10,
  QUIZ_COMPLETE: 50,
  VIEW_PROJECT: 3,
  DOWNLOAD_DATA: 200,
  REFERRAL: 50,
  USE_CALCULATOR: 25,
  DOWNLOAD_CHECKLIST: 15,
  SHARE_SOCIAL: 20
};

export function calculateLevel(points: number): number {
  if (points >= 1000) return 10;
  if (points >= 750) return 9;
  if (points >= 500) return 8;
  if (points >= 350) return 7;
  if (points >= 250) return 6;
  if (points >= 150) return 5;
  if (points >= 100) return 4;
  if (points >= 60) return 3;
  if (points >= 30) return 2;
  return 1;
}

export function getLevelTitle(level: number): string {
  const titles: { [key: number]: string } = {
    1: 'Rookie',
    2: 'Explorer',
    3: 'Builder',
    4: 'Entrepreneur',
    5: 'Pro',
    6: 'Expert',
    7: 'Master',
    8: 'Legend',
    9: 'Titan',
    10: 'God Mode'
  };
  return titles[level] || 'Rookie';
}

export function getNextLevelPoints(currentPoints: number): number {
  const levels = [0, 30, 60, 100, 150, 250, 350, 500, 750, 1000];
  const currentLevel = calculateLevel(currentPoints);
  return levels[currentLevel] || 1000;
}

export function checkBadgeEligibility(progress: UserProgress): string[] {
  const newBadges: string[] = [];

  // Early Adopter (example: first 100 users - you'll need to track this)
  // This would be set server-side when user count is checked

  if (progress.actions.quizCompleted && !progress.badges.includes('quiz_master')) {
    newBadges.push('quiz_master');
  }

  if (progress.actions.projectsViewed >= 10 && !progress.badges.includes('explorer')) {
    newBadges.push('explorer');
  }

  if (progress.actions.projectsViewed >= 50 && !progress.badges.includes('power_user')) {
    newBadges.push('power_user');
  }

  if (progress.actions.dataDownloaded && !progress.badges.includes('data_collector')) {
    newBadges.push('data_collector');
  }

  if (progress.actions.referrals >= 3 && !progress.badges.includes('influencer')) {
    newBadges.push('influencer');
  }

  if (!progress.badges.includes('starter')) {
    newBadges.push('starter');
  }

  return newBadges;
}
