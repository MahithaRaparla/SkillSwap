import { ACHIEVEMENTS_DEFINITION } from '../data/demoData';
import { getUnlockedAchievements, unlockAchievementInStorage, addNotification } from './storageService';
import { calculateStreakStats, calculateOverviewStats } from './analyticsService';
import confetti from 'canvas-confetti';

export const checkAndUnlockAchievements = (userId, goals = [], activities = [], skills = [], connections = []) => {
  const currentUnlockedIds = getUnlockedAchievements();
  const streakStats = calculateStreakStats(activities, userId);
  const overview = calculateOverviewStats(userId, goals, activities, skills, connections);

  const newlyUnlocked = [];

  // Check 1: First Step (>= 1 activity)
  if (activities.length >= 1 && !currentUnlockedIds.includes('first_step')) {
    newlyUnlocked.push('first_step');
  }

  // Check 2: Goal Getter (>= 1 completed goal)
  if (overview.completedGoals >= 1 && !currentUnlockedIds.includes('goal_getter')) {
    newlyUnlocked.push('goal_getter');
  }

  // Check 3: Consistent Learner (7-day streak)
  if (streakStats.currentStreak >= 7 && !currentUnlockedIds.includes('consistent_learner')) {
    newlyUnlocked.push('consistent_learner');
  }

  // Check 4: Knowledge Sharer (>= 1 teaching session)
  if (overview.teachingSessions >= 1 && !currentUnlockedIds.includes('knowledge_sharer')) {
    newlyUnlocked.push('knowledge_sharer');
  }

  // Check 5: Skill Explorer (>= 4 skills total)
  if (skills.length >= 4 && !currentUnlockedIds.includes('skill_explorer')) {
    newlyUnlocked.push('skill_explorer');
  }

  // Check 6: Community Builder (>= 3 connections)
  if (overview.connectionsCount >= 3 && !currentUnlockedIds.includes('community_builder')) {
    newlyUnlocked.push('community_builder');
  }

  // Check 7: Learning Champion (>= 10 activities)
  if (activities.length >= 10 && !currentUnlockedIds.includes('learning_champion')) {
    newlyUnlocked.push('learning_champion');
  }

  // Check 8: Skill Master (100% progress on a goal)
  const hasMasteredGoal = goals.some((g) => g.currentProgress === 100);
  if (hasMasteredGoal && !currentUnlockedIds.includes('skill_master')) {
    newlyUnlocked.push('skill_master');
  }

  // Check 9: Dedicated Learner (>= 10 hours)
  if (parseFloat(overview.totalHours) >= 10 && !currentUnlockedIds.includes('dedicated_learner')) {
    newlyUnlocked.push('dedicated_learner');
  }

  // Process newly unlocked achievements
  const unlockedObjects = [];
  newlyUnlocked.forEach((id) => {
    const isNew = unlockAchievementInStorage(id);
    if (isNew) {
      const def = ACHIEVEMENTS_DEFINITION.find((a) => a.id === id);
      if (def) {
        unlockedObjects.push(def);
        addNotification({
          userId,
          title: `🏆 Achievement Unlocked: ${def.title}`,
          message: def.description,
          type: 'achievement'
        });
      }
    }
  });

  if (unlockedObjects.length > 0) {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback if confetti fails
    }
  }

  return unlockedObjects;
};
