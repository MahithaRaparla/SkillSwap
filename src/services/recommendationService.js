import { getTopMatchesForUser } from './matchingService';

export const getPersonalizedRecommendations = (currentUser, allUsers = [], allSkills = [], goals = [], activities = []) => {
  if (!currentUser) {
    return {
      partnerRecommendations: [],
      skillSuggestions: [],
      goalActionItems: [],
      streakReminders: []
    };
  }

  // 1. Partner Recommendations based on top skill matches
  const topMatches = getTopMatchesForUser(currentUser, allUsers, allSkills, 4);

  // 2. Skill Suggestions based on user's current teach/learn skills
  const userSkills = allSkills.filter((s) => s.userId === currentUser.id);
  const userLearnNames = userSkills.filter((s) => s.type === 'learn').map((s) => s.name.toLowerCase());
  const userTeachNames = userSkills.filter((s) => s.type === 'teach').map((s) => s.name.toLowerCase());

  const skillSuggestions = [];

  if (userLearnNames.includes('react') && !userLearnNames.includes('typescript')) {
    skillSuggestions.push({
      title: 'Add TypeScript',
      category: 'Programming & Tech',
      reason: 'Since you are learning React, adding TypeScript will enhance your type safety and component scalability.'
    });
  }

  if (userLearnNames.includes('ui/ux design') && !userLearnNames.includes('figma')) {
    skillSuggestions.push({
      title: 'Add Figma Mastery',
      category: 'Design & UI/UX',
      reason: 'Figma is the industry-standard UI prototyping tool that pairs perfectly with UI/UX Design.'
    });
  }

  if (userTeachNames.includes('javascript') && !userTeachNames.includes('node.js')) {
    skillSuggestions.push({
      title: 'Teach Node.js',
      category: 'Programming & Tech',
      reason: 'You already possess Advanced JavaScript skills. Offering Node.js can double your skill-swap requests!'
    });
  }

  if (skillSuggestions.length === 0) {
    skillSuggestions.push({
      title: 'Explore Public Speaking',
      category: 'Communication & Soft Skills',
      reason: 'Soft skills complement technical expertise and make you a high-demand peer mentor.'
    });
  }

  // 3. Goal Action Items
  const goalActionItems = [];
  const activeGoals = goals.filter((g) => g.userId === currentUser.id && g.status === 'Active');

  activeGoals.forEach((goal) => {
    if (goal.currentProgress >= 60 && goal.currentProgress < 100) {
      goalActionItems.push({
        id: goal.id,
        title: `Goal Final Stretch: ${goal.title}`,
        type: 'progress',
        message: `You are at ${goal.currentProgress}% completion! Complete the remaining milestones to earn the Skill Master badge.`
      });
    } else if (goal.currentProgress < 30) {
      goalActionItems.push({
        id: goal.id,
        title: `Kickstart Goal: ${goal.title}`,
        type: 'start',
        message: `Your progress is at ${goal.currentProgress}%. Record a learning session today to boost momentum!`
      });
    }
  });

  if (activeGoals.length === 0) {
    goalActionItems.push({
      id: 'create_new_goal',
      title: 'Create Your First Learning Goal',
      type: 'create',
      message: 'Setting structured learning goals with milestones increases skill acquisition speed by 40%.'
    });
  }

  // 4. Streak / Activity Reminders
  const userActivities = activities.filter((a) => a.userId === currentUser.id);
  const streakReminders = [];

  const todayStr = new Date().toISOString().split('T')[0];
  const loggedToday = userActivities.some((a) => a.date === todayStr);

  if (!loggedToday) {
    streakReminders.push({
      title: 'Maintain Your Streak! 🔥',
      message: 'Log at least 15 minutes of practice or learning today to keep your daily streak alive.'
    });
  } else {
    streakReminders.push({
      title: 'Great Job Today! 🌟',
      message: 'You have logged an activity today! Review your analytics to see total hours gained.'
    });
  }

  return {
    partnerRecommendations: topMatches,
    skillSuggestions,
    goalActionItems,
    streakReminders
  };
};
