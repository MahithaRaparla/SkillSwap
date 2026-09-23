import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserCard } from '../components/cards/UserCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Link2, Check, X, UserMinus, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConnectionsPage = () => {
  const { currentUser } = useAuth();
  const { users, skills, connections, updateConnectionStatus } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('connected'); // 'connected' | 'pending' | 'requests'

  // Accepted Connections
  const acceptedConns = connections.filter(
    (c) => (c.requesterId === currentUser?.id || c.receiverId === currentUser?.id) && c.status === 'Accepted'
  );

  // Incoming Requests
  const incomingRequests = connections.filter(
    (c) => c.receiverId === currentUser?.id && c.status === 'Pending'
  );

  // Outgoing Sent Requests
  const outgoingRequests = connections.filter(
    (c) => c.requesterId === currentUser?.id && c.status === 'Pending'
  );

  const getConnectedUserObj = (conn) => {
    const targetId = conn.requesterId === currentUser?.id ? conn.receiverId : conn.requesterId;
    return users.find((u) => u.id === targetId);
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Link2 className="w-7 h-7 text-indigo-400" /> My Learning Connections
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage peer mentors, incoming exchange requests, and active connections.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'connected'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          My Connections ({acceptedConns.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Incoming Requests ({incomingRequests.length})
          {incomingRequests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Sent Requests ({outgoingRequests.length})
        </button>
      </div>

      {/* Connected Users List */}
      {activeTab === 'connected' && (
        acceptedConns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedConns.map((conn) => {
              const partner = getConnectedUserObj(conn);
              if (!partner) return null;

              const uTeach = skills.filter((s) => s.userId === partner.id && s.type === 'teach');
              const uLearn = skills.filter((s) => s.userId === partner.id && s.type === 'learn');

              return (
                <div key={conn.id} className="relative group">
                  <UserCard
                    user={partner}
                    skillsOffered={uTeach}
                    skillsWanted={uLearn}
                    isConnected={true}
                  />
                  <button
                    onClick={() => updateConnectionStatus(conn.id, 'Removed')}
                    className="mt-2 w-full py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center justify-center gap-1 border border-rose-500/20"
                  >
                    <UserMinus className="w-3.5 h-3.5" /> Remove Connection
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Connected Partners Yet"
            description="Explore community skills and send connection requests to start swapping knowledge!"
            actionText="Find Partners"
            onAction={() => navigate('/partners')}
          />
        )
      )}

      {/* Incoming Requests */}
      {activeTab === 'requests' && (
        incomingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incomingRequests.map((conn) => {
              const requester = users.find((u) => u.id === conn.requesterId);
              if (!requester) return null;

              return (
                <div key={conn.id} className="glass-card p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={requester.avatar}
                      alt={requester.fullName}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{requester.fullName}</h4>
                      <p className="text-xs text-slate-400">{requester.status} • {requester.location}</p>
                      <p className="text-[11px] text-indigo-400 mt-1 font-semibold">Wants to connect for skill exchange</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => updateConnectionStatus(conn.id, 'Accepted')}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                    >
                      <Check className="w-4 h-4" /> Accept Connection
                    </button>
                    <button
                      onClick={() => updateConnectionStatus(conn.id, 'Rejected')}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Ignore
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Incoming Requests"
            description="When other users send you connection requests, they will appear here."
          />
        )
      )}

      {/* Sent Requests */}
      {activeTab === 'pending' && (
        outgoingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outgoingRequests.map((conn) => {
              const receiver = users.find((u) => u.id === conn.receiverId);
              if (!receiver) return null;

              return (
                <div key={conn.id} className="glass-card p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={receiver.avatar}
                      alt={receiver.fullName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-base font-bold text-white">{receiver.fullName}</h4>
                      <p className="text-xs text-slate-400">{receiver.status} • {receiver.location}</p>
                      <p className="text-[11px] text-amber-400 mt-1 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting response...
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => updateConnectionStatus(conn.id, 'Removed')}
                    className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors pt-3 border-t border-slate-800"
                  >
                    Cancel Request
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Pending Outgoing Requests"
            description="You haven't sent any pending connection requests."
          />
        )
      )}
    </div>
  );
};
