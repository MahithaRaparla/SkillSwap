import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getTopMatchesForUser } from '../services/matchingService';
import { MatchCard } from '../components/cards/MatchCard';
import { Sparkles, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

const getId = (v) => (typeof v === 'object' && v ? (v.id || v._id?.toString()) : v);

export const LearningOpportunitiesPage = () => {
  const { currentUser } = useAuth();
  const { users, skills, connections, sendConnectionRequest } = useData();

  const currentUserId = getId(currentUser);
  const matches = getTopMatchesForUser(currentUser, users, skills, 10);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" /> Learning Exchange Opportunities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          High-compatibility peer exchanges sorted by mutual skill match algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match, idx) => {
          const matchUserId = getId(match.user);
          const isConn = connections.some(
            (c) =>
              ((getId(c.requesterId) === currentUserId && getId(c.receiverId) === matchUserId) ||
                (getId(c.requesterId) === matchUserId && getId(c.receiverId) === currentUserId)) &&
              c.status === 'Accepted'
          );
          const isPend = connections.some(
            (c) =>
              ((getId(c.requesterId) === currentUserId && getId(c.receiverId) === matchUserId) ||
                (getId(c.requesterId) === matchUserId && getId(c.receiverId) === currentUserId)) &&
              c.status === 'Pending'
          );

          return (
            <MatchCard
              key={idx}
              match={match}
              onConnect={sendConnectionRequest}
              isConnected={isConn}
              isPending={isPend}
            />
          );
        })}
      </div>
    </div>
  );
};
