import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { socket } from '../../socket/socket';
import { 
  Users, UserPlus, Shield, Sparkles, Check, X, 
  Trash2, UserCheck, Search, Flame, Award, Clock, 
  Radio, Swords, Crown, AlertCircle, RefreshCw
} from 'lucide-react';
import { PlayerProfileModal } from '../common/PlayerProfileModal';
import { SanitizedUserProfile } from '../../../server/db/database';

interface FriendItem {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  customAvatarUrl?: string;
  level: number;
  xp: number;
  rankedTier: string;
  rankedDivision: number;
  rankedRating: number;
  wins: number;
  matchesPlayed: number;
  favoriteCharacterId?: string;
  isOnline?: boolean;
}

interface RequestItem {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  customAvatarUrl?: string;
  level: number;
}

export interface PartyMember {
  userId: string;
  socketId: string;
  username: string;
  displayName: string;
  avatar: string;
  customAvatarUrl?: string;
  level: number;
  isLeader: boolean;
  isReady: boolean;
}

export interface PartyState {
  id: string;
  leaderId: string;
  members: PartyMember[];
  createdAt: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partyState?: PartyState | null;
  onUpdateParty?: (party: PartyState | null) => void;
}

export function FriendsModal({ isOpen, onClose, partyState, onUpdateParty }: Props) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add' | 'party'>('friends');
  
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [incoming, setIncoming] = useState<RequestItem[]>([]);
  const [outgoing, setOutgoing] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addUsername, setAddUsername] = useState('');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Friend Profile Inspection Modal
  const [inspectedFriend, setInspectedFriend] = useState<SanitizedUserProfile | null>(null);

  const fetchFriendsData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/social/friends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFriends(data.friends || []);
        setIncoming(data.incomingRequests || []);
        setOutgoing(data.outgoingRequests || []);
      }
    } catch (err) {
      console.error('[FriendsModal] Failed to load friends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchFriendsData();
    }
  }, [isOpen, token]);

  // Socket listeners for real-time social updates
  useEffect(() => {
    if (!socket || !token) return;

    // Authenticate socket presence
    socket.emit('social_auth', { token });

    const handlePresenceChanged = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      setFriends(prev => prev.map(f => f.id === userId ? { ...f, isOnline } : f));
    };

    const handleRequestReceived = (req: RequestItem) => {
      soundManager.playClick();
      setIncoming(prev => [req, ...prev.filter(r => r.id !== req.id)]);
      setActionMessage({ type: 'success', text: `New friend request from ${req.displayName || req.username}!` });
      setTimeout(() => setActionMessage(null), 4000);
    };

    const handleRequestAccepted = (friend: FriendItem) => {
      soundManager.playVictory();
      setOutgoing(prev => prev.filter(r => r.id !== friend.id));
      fetchFriendsData();
      setActionMessage({ type: 'success', text: `${friend.displayName || friend.username} accepted your friend request!` });
      setTimeout(() => setActionMessage(null), 4000);
    };

    const handlePartyUpdated = (party: PartyState) => {
      onUpdateParty?.(party);
    };

    socket.on('player_presence_changed', handlePresenceChanged);
    socket.on('friend_request_received', handleRequestReceived);
    socket.on('friend_request_accepted', handleRequestAccepted);
    socket.on('party_state_updated', handlePartyUpdated);

    return () => {
      socket.off('player_presence_changed', handlePresenceChanged);
      socket.off('friend_request_received', handleRequestReceived);
      socket.off('friend_request_accepted', handleRequestAccepted);
      socket.off('party_state_updated', handlePartyUpdated);
    };
  }, [token]);

  if (!isOpen) return null;

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUsername.trim() || !token) return;
    try {
      const res = await fetch('/api/social/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUsername: addUsername.trim() })
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playClick();
        setActionMessage({ type: 'success', text: `Friend request sent to ${addUsername}!` });
        setAddUsername('');
        fetchFriendsData();
      } else {
        soundManager.playAttackHit();
        setActionMessage({ type: 'error', text: data.error || 'Failed to send friend request.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Network connection failed.' });
    }
  };

  const handleAccept = async (requesterUserId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/social/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requesterUserId })
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playVictory();
        setActionMessage({ type: 'success', text: 'Friend request accepted!' });
        fetchFriendsData();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to accept request.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Network error.' });
    }
  };

  const handleDecline = async (requesterUserId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/social/friends/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requesterUserId })
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playClick();
        setIncoming(prev => prev.filter(r => r.id !== requesterUserId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async (targetUserId: string, name: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to remove ${name} from your friends?`)) return;
    try {
      const res = await fetch('/api/social/friends/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      if (data.success) {
        soundManager.playClick();
        setFriends(prev => prev.filter(f => f.id !== targetUserId));
        setActionMessage({ type: 'success', text: `Removed ${name} from friends.` });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInspectProfile = async (friendId: string) => {
    try {
      const res = await fetch(`/api/social/profile/${friendId}`);
      const data = await res.json();
      if (data.success && data.profile) {
        soundManager.playClick();
        setInspectedFriend(data.profile);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleInviteToParty = (targetUserId: string, friendName: string) => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('party_invite', { targetUserId }, (res: any) => {
      if (res?.success) {
        setActionMessage({ type: 'success', text: `Party invite sent to ${friendName}!` });
      } else {
        soundManager.playAttackHit();
        setActionMessage({ type: 'error', text: res?.error || 'Failed to invite to party.' });
      }
      setTimeout(() => setActionMessage(null), 3500);
    });
  };

  const handleCreateParty = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('party_create', {}, (res: any) => {
      if (res?.success && res.party) {
        onUpdateParty?.(res.party);
        setActiveTab('party');
      }
    });
  };

  const handleToggleReady = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('party_toggle_ready', (res: any) => {
      if (res?.success && partyState && user) {
        const updated = { ...partyState };
        const member = updated.members.find(m => m.userId === user.id);
        if (member) member.isReady = res.isReady;
        onUpdateParty?.(updated);
      }
    });
  };

  const handleLeaveParty = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('party_leave', () => {
      onUpdateParty?.(null);
    });
  };

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 animate-fadeIn select-none">
        <div className="relative w-full max-w-2xl bg-[#090D1A] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Top Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wider flex items-center gap-2">
                  <span>MARVEL ALLIANCE & SQUAD</span>
                  <span className="text-xs font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full">
                    {friends.length} / 100
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Real-time friends, squad parties & player dossiers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchFriendsData}
                disabled={isLoading}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Refresh Friends"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-red-400 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-2 sm:px-5 bg-black/30 border-b border-white/10 overflow-x-auto">
            <button
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab('friends'); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'friends'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends ({friends.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab('requests'); }}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Requests</span>
              {incoming.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
                  {incoming.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab('add'); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>

            <button
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab('party'); }}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'party'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-cosmic'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Party ({partyState?.members.length || 0}/5)</span>
              {partyState && partyState.members.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Action Notification Alert */}
          {actionMessage && (
            <div className={`mx-4 sm:mx-5 mt-3 p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border-red-500 text-red-300'
            }`}>
              {actionMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* TAB 1: FRIENDS LIST */}
            {activeTab === 'friends' && (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search friends by name..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
                  />
                </div>

                {filteredFriends.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl text-slate-500">
                      👥
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-white">No Friends Found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        {searchTerm ? 'No friends matched your search query.' : 'You haven\'t added any friends yet. Add commanders using the "Add Friend" tab!'}
                      </p>
                    </div>
                    {!searchTerm && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('add')}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Add Commander
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredFriends.map(friend => (
                      <div
                        key={friend.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between gap-3 transition-all group"
                      >
                        <div 
                          onClick={() => handleInspectProfile(friend.id)}
                          className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                          title="Click to view full dossier"
                        >
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center text-lg bg-black">
                              {friend.customAvatarUrl ? (
                                <img src={friend.customAvatarUrl} alt={friend.displayName} className="w-full h-full object-cover" />
                              ) : (
                                <span>{friend.avatar}</span>
                              )}
                            </div>
                            {/* Online / Offline Presence Dot */}
                            <span 
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#090D1A] ${
                                friend.isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'
                              }`}
                              title={friend.isOnline ? 'Online' : 'Offline'}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-heading font-black text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                                {friend.displayName || friend.username}
                              </span>
                              <span className="text-[9px] bg-amber-500 text-black font-black px-1.5 py-0.2 rounded font-mono">
                                LVL {friend.level}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                              <span className="text-cyan-400 font-bold">{friend.rankedTier} ({friend.rankedRating} MMR)</span>
                              <span>•</span>
                              <span>{friend.wins} Wins</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleInviteToParty(friend.id, friend.displayName || friend.username)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 hover:bg-purple-900 text-purple-200 hover:text-white text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                            title="Invite to Squad Party"
                          >
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span className="hidden xs:inline">Invite Party</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInspectProfile(friend.id)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-white/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                            title="View Dossier"
                          >
                            <Shield className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveFriend(friend.id, friend.displayName || friend.username)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-950 border border-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                            title="Remove Friend"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REQUESTS (INCOMING & OUTGOING) */}
            {activeTab === 'requests' && (
              <div className="space-y-5">
                {/* Incoming Requests */}
                <div>
                  <h4 className="font-heading font-black text-xs text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Incoming Requests ({incoming.length})</span>
                  </h4>
                  {incoming.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center text-xs text-slate-500">
                      No pending incoming friend requests.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {incoming.map(req => (
                        <div key={req.id} className="p-3 rounded-2xl bg-black/50 border border-amber-500/30 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center text-base bg-black">
                              {req.customAvatarUrl ? (
                                <img src={req.customAvatarUrl} alt={req.displayName} className="w-full h-full object-cover" />
                              ) : (
                                <span>{req.avatar}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-heading font-black text-xs text-white">
                                {req.displayName || req.username}
                              </div>
                              <span className="text-[10px] text-amber-400 font-mono">Level {req.level}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAccept(req.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecline(req.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950 border border-white/10 text-slate-400 hover:text-red-400 text-xs transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Outgoing Requests */}
                <div>
                  <h4 className="font-heading font-black text-xs text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Outgoing Pending Requests ({outgoing.length})</span>
                  </h4>
                  {outgoing.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center text-xs text-slate-500">
                      No pending outgoing friend requests.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {outgoing.map(req => (
                        <div key={req.id} className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-sm">
                              {req.avatar}
                            </div>
                            <div>
                              <div className="font-heading font-black text-xs text-slate-300">
                                {req.displayName || req.username}
                              </div>
                              <span className="text-[9px] text-slate-500 font-mono">Pending response...</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono italic">Sent</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ADD FRIEND */}
            {activeTab === 'add' && (
              <div className="space-y-5 py-2">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-black to-blue-950/40 border border-cyan-500/30 space-y-4">
                  <div>
                    <h3 className="font-heading font-black text-base text-white">Find & Enlist Commanders</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Enter the exact username of any Marvel Ascension commander to send an alliance invitation.</p>
                  </div>

                  <form onSubmit={handleSendRequest} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={addUsername}
                        onChange={e => setAddUsername(e.target.value)}
                        placeholder="Commander username (e.g. darksenseify)"
                        className="w-full bg-black/60 border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-black text-xs uppercase tracking-wider transition-all shadow-glow-cyan cursor-pointer"
                    >
                      Send Invite
                    </button>
                  </form>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-[11px] text-slate-400 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Alliance Guidelines:</span>
                  </div>
                  <p>• Players can have a maximum of 100 friends.</p>
                  <p>• Mutual friend requests are instantly auto-accepted.</p>
                  <p>• Once allied, you can invite friends directly into real-time squad lobbies.</p>
                </div>
              </div>
            )}

            {/* TAB 4: SQUAD PARTY */}
            {activeTab === 'party' && (
              <div className="space-y-4">
                {!partyState || partyState.members.length === 0 ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-950/60 border-2 border-purple-500/50 flex items-center justify-center text-3xl shadow-glow-cosmic">
                      👑
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-base text-white">No Active Squad Party</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                        Form a party to queue for multiplayer battles together and play co-op sessions with your friends.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateParty}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-glow-cosmic cursor-pointer"
                    >
                      Create Squad Party
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Party Header Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-black to-indigo-950/80 border border-purple-500/40 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span className="font-heading font-black text-sm text-white">SQUAD PARTY: {partyState.id}</span>
                        </div>
                        <span className="text-[10px] text-purple-300 font-mono">Members: {partyState.members.length} / 5</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleReady}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-xs uppercase transition-all cursor-pointer shadow-sm"
                        >
                          {partyState.members.find(m => m.userId === user?.id)?.isReady ? 'Ready ✓' : 'Set Ready'}
                        </button>
                        <button
                          type="button"
                          onClick={handleLeaveParty}
                          className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          Leave Party
                        </button>
                      </div>
                    </div>

                    {/* Member Slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {partyState.members.map((member, index) => (
                        <div
                          key={member.userId}
                          className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center text-lg bg-black">
                                {member.customAvatarUrl ? (
                                  <img src={member.customAvatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{member.avatar}</span>
                                )}
                              </div>
                              {member.isLeader && (
                                <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-1.5 -left-1.5 filter drop-shadow" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-heading font-black text-xs text-white">{member.displayName || member.username}</span>
                                {member.userId === user?.id && <span className="text-[9px] text-cyan-400">(You)</span>}
                              </div>
                              <span className="text-[10px] text-amber-400 font-mono">Level {member.level}</span>
                            </div>
                          </div>

                          <div>
                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                              member.isReady 
                                ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300' 
                                : 'bg-slate-900 border border-white/10 text-slate-400'
                            }`}>
                              {member.isReady ? 'READY' : 'NOT READY'}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Empty Slots */}
                      {Array.from({ length: 5 - partyState.members.length }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          onClick={() => setActiveTab('friends')}
                          className="p-3 rounded-2xl bg-black/20 border border-dashed border-white/15 flex items-center justify-center gap-2 text-slate-500 hover:text-purple-300 hover:border-purple-500/40 cursor-pointer transition-all min-h-[62px]"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="text-xs font-bold">+ Invite Friend</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="p-3 sm:px-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono">Logged in as {user?.displayName || user?.username}</span>
            <span className="text-cyan-400 font-mono">100 Max Friends</span>
          </div>

        </div>
      </div>

      {/* Embedded Friend Profile Modal */}
      {inspectedFriend && (
        <PlayerProfileModal
          isOpen={true}
          onClose={() => setInspectedFriend(null)}
          viewOnlyProfile={inspectedFriend}
        />
      )}
    </>
  );
}
