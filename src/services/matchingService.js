// Client-side Skill Matching Engine

export const calculateSkillMatch = (userA, userB, allSkills = []) => {
  if (!userA || !userB || userA.id === userB.id) {
    return { matchScore: 0, explanation: 'Same user', isMutual: false, matchType: 'None' };
  }

  // Get skills for User A
  const userASkills = allSkills.filter((s) => s.userId === userA.id && s.active !== false);
  const userATeach = userASkills.filter((s) => s.type === 'teach');
  const userALearn = userASkills.filter((s) => s.type === 'learn');

  // Get skills for User B
  const userBSkills = allSkills.filter((s) => s.userId === userB.id && s.active !== false);
  const userBTeach = userBSkills.filter((s) => s.type === 'teach');
  const userBLearn = userBSkills.filter((s) => s.type === 'learn');

  // 1. Direct Match: User A wants what User B teaches
  const skillsUserACanLearnFromB = userALearn.filter((learnSkill) =>
    userBTeach.some((teachSkill) => teachSkill.name.toLowerCase() === learnSkill.name.toLowerCase())
  );

  // 2. Direct Match: User B wants what User A teaches
  const skillsUserBCanLearnFromA = userBLearn.filter((learnSkill) =>
    userATeach.some((teachSkill) => teachSkill.name.toLowerCase() === learnSkill.name.toLowerCase())
  );

  // 3. Shared Interests
  const interestsA = userA.interests || [];
  const interestsB = userB.interests || [];
  const sharedInterests = interestsA.filter((i) => interestsB.includes(i));

  // Calculate Weights & Score
  let score = 25; // Base starting compatibility score
  let matchType = 'General Compatibility';
  let explanations = [];

  const isMutual = skillsUserACanLearnFromB.length > 0 && skillsUserBCanLearnFromA.length > 0;

  if (isMutual) {
    score += 55; // Huge boost for mutual exchange
    matchType = 'Mutual Exchange';
    const learnName = skillsUserACanLearnFromB[0].name;
    const teachName = skillsUserBCanLearnFromA[0].name;
    explanations.push(`Perfect Mutual Exchange: You can teach ${teachName}, while ${userB.fullName} can teach ${learnName}!`);
  } else if (skillsUserACanLearnFromB.length > 0) {
    score += 40;
    matchType = 'Direct Match';
    const learnName = skillsUserACanLearnFromB[0].name;
    explanations.push(`${userB.fullName} can teach ${learnName}, which is on your wishlist.`);
  } else if (skillsUserBCanLearnFromA.length > 0) {
    score += 35;
    matchType = 'Direct Match';
    const teachName = skillsUserBCanLearnFromA[0].name;
    explanations.push(`You can teach ${teachName}, which ${userB.fullName} wants to learn.`);
  }

  // Interest match bonus
  if (sharedInterests.length > 0) {
    score += Math.min(sharedInterests.length * 6, 15);
    if (!isMutual && skillsUserACanLearnFromB.length === 0 && skillsUserBCanLearnFromA.length === 0) {
      matchType = 'Interest Match';
    }
    explanations.push(`Shared interests in ${sharedInterests.slice(0, 3).join(', ')}.`);
  }

  // Location / Status bonus
  if (userA.location && userB.location && userA.location === userB.location) {
    score += 5;
  }

  // Normalize final score between 40 and 98 for realistic distribution
  const finalScore = Math.min(Math.max(score, 35), 98);

  return {
    matchScore: finalScore,
    matchType,
    isMutual,
    canLearnSkill: skillsUserACanLearnFromB[0]?.name || null,
    canTeachSkill: skillsUserBCanLearnFromA[0]?.name || null,
    explanation: explanations.join(' ') || 'Compatible learning profiles in similar categories.'
  };
};

export const getTopMatchesForUser = (user, allUsers = [], allSkills = [], limit = 6) => {
  if (!user) return [];

  const otherUsers = allUsers.filter((u) => u.id !== user.id);

  const matched = otherUsers.map((targetUser) => {
    const result = calculateSkillMatch(user, targetUser, allSkills);
    return {
      user: targetUser,
      ...result
    };
  });

  // Sort descending by matchScore
  matched.sort((a, b) => b.matchScore - a.matchScore);

  return limit ? matched.slice(0, limit) : matched;
};
