// Analytics, Streaks & Progress Calculator Service

export const calculateStreakStats = (activities = [], userId) => {
  const userActivities = activities.filter((a) => a.userId === userId || !a.userId);
  if (!userActivities.length) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0, weeklyConsistency: 0 };
  }

  // Get unique dates sorted ascending
  const uniqueDates = Array.from(
    new Set(userActivities.map((a) => a.date))
  ).sort((a, b) => new Date(a) - new Date(b));

  const totalActiveDays = uniqueDates.length;

  if (totalActiveDays === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0, weeklyConsistency: 0 };
  }

  let longest = 1;
  let tempStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffTime = Math.abs(curr - prev);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      if (tempStreak > longest) longest = tempStreak;
    } else if (diffDays > 1) {
      tempStreak = 1;
    }
  }

  // Check current streak based on today's or yesterday's activity
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const hasToday = uniqueDates.includes(todayStr);
  const hasYesterday = uniqueDates.includes(yesterdayStr);

  let currentStreak = 0;
  if (hasToday || hasYesterday) {
    let currCount = 0;
    let checkDate = new Date(hasToday ? todayStr : yesterdayStr);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dateStr)) {
        currCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = currCount;
  } else {
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longest, currentStreak),
    totalActiveDays,
    weeklyConsistency: Math.min(Math.round((totalActiveDays / 7) * 100), 100)
  };
};

export const calculateOverviewStats = (userId, goals = [], activities = [], skills = [], connections = []) => {
  const userGoals = goals.filter((g) => g.userId === userId || !g.userId);
  const userActivities = activities.filter((a) => a.userId === userId || !a.userId);
  const userSkills = skills.filter((s) => s.userId === userId || !s.userId);
  const userConnections = connections.filter(
    (c) => (c.requesterId === userId || c.receiverId === userId) && c.status === 'Accepted'
  );

  const totalMinutes = userActivities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const completedGoals = userGoals.filter((g) => g.status === 'Completed' || g.currentProgress === 100).length;
  const activeGoals = userGoals.length - completedGoals;

  const teachingSessions = userActivities.filter((a) => a.activityType === 'Teaching Session' || a.sessionType === 'Teaching' || a.sessionType === 'Mutual Exchange').length;
  const learningSessions = userActivities.length - teachingSessions;

  const skillsTeachCount = userSkills.filter((s) => s.type === 'teach').length;
  const skillsLearnCount = userSkills.filter((s) => s.type === 'learn').length;

  return {
    totalHours,
    totalMinutes,
    totalSessions: userActivities.length,
    completedGoals,
    activeGoals,
    totalGoals: userGoals.length,
    teachingSessions,
    learningSessions,
    skillsTeachCount,
    skillsLearnCount,
    connectionsCount: userConnections.length,
    goalCompletionRate: userGoals.length ? Math.round((completedGoals / userGoals.length) * 100) : 0
  };
};

export const getChartDataHoursByDate = (activities = [], userId) => {
  const userActivities = activities.filter((a) => a.userId === userId || !a.userId);
  
  // Group activities by date
  const map = {};
  userActivities.forEach((act) => {
    const d = act.date;
    const hours = (act.durationMinutes || 0) / 60;
    map[d] = (map[d] || 0) + hours;
  });

  const sortedDates = Object.keys(map).sort();

  return sortedDates.map((dateStr) => {
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: formattedDate,
      hours: Number(map[dateStr].toFixed(1))
    };
  });
};

export const getSkillProgressChartData = (goals = [], userId) => {
  const userGoals = goals.filter((g) => g.userId === userId || !g.userId);

  return userGoals.map((goal) => ({
    skill: goal.skill,
    progress: goal.currentProgress || 0,
    target: 100
  }));
};

export const generateSkillDevelopmentReport = (user, goals = [], activities = [], skills = []) => {
  const overview = calculateOverviewStats(user?.id, goals, activities, skills);
  const streakStats = calculateStreakStats(activities, user?.id);
  const userGoals = goals.filter((g) => g.userId === user?.id || !g.userId);

  const strongestSkillGoal = [...userGoals].sort((a, b) => (b.currentProgress || 0) - (a.currentProgress || 0))[0];
  const laggingSkillGoal = [...userGoals].sort((a, b) => (a.currentProgress || 0) - (b.currentProgress || 0))[0];

  return {
    userName: user?.fullName || 'SkillSwap Learner',
    status: user?.status || 'Student',
    location: user?.location || 'Global',
    generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    totalHours: overview.totalHours,
    totalSessions: overview.totalSessions,
    currentStreak: streakStats.currentStreak,
    longestStreak: streakStats.longestStreak,
    goalCompletionRate: overview.goalCompletionRate,
    strongestSkill: strongestSkillGoal ? `${strongestSkillGoal.skill} (${strongestSkillGoal.currentProgress}%)` : 'React (65%)',
    skillNeedingImprovement: laggingSkillGoal ? `${laggingSkillGoal.skill} (${laggingSkillGoal.currentProgress}%)` : 'Python (40%)',
    summaryInsights: [
      `Completed ${overview.completedGoals} out of ${overview.totalGoals} active learning goals with a ${overview.goalCompletionRate}% goal completion rate.`,
      `Accumulated ${overview.totalHours} hours of dedicated peer learning and teaching sessions.`,
      `Maintained a maximum learning streak of ${streakStats.longestStreak} days with active community engagement.`
    ]
  };
};
