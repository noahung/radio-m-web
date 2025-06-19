import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStationComments, addComment, subscribeToComments } from '../../lib/supabase';
import { Comment } from '../../types';
import NeumorphicButton from '../UI/NeumorphicButton';
import LoadingSpinner from '../UI/LoadingSpinner';

interface CommentSectionProps {
  stationId: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ stationId, isCollapsed, onToggle }) => {
  const { authState } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
    
    // Subscribe to real-time updates
    const subscription = subscribeToComments(stationId, (payload) => {
      if (payload.eventType === 'INSERT') {
        setComments(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setComments(prev => prev.filter(comment => comment.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stationId]);

  const loadComments = async () => {
    try {
      const { data, error } = await getStationComments(stationId);
      if (data && !error) {
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !authState.isAuthenticated || !authState.user) return;

    setSubmitting(true);
    try {
      const { data, error } = await addComment(stationId, newComment.trim(), authState.user.id);
      if (data && !error) {
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div 
      className="bg-slate-800/30 backdrop-blur-lg rounded-t-3xl border-t border-slate-700/30 transition-all duration-300"
      style={{
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(148, 163, 184, 0.1)'
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/20 transition-colors rounded-t-3xl"
      >
        <div className="flex items-center gap-3">
          <MessageCircle size={20} className="text-blue-400" />
          <span className="text-white font-semibold">Live Comments</span>
          <span className="text-xs text-slate-400 bg-slate-700/40 px-2 py-1 rounded-full">
            {comments.length}
          </span>
        </div>
        {isCollapsed ? (
          <ChevronUp size={20} className="text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-400" />
        )}
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          {/* Comment Input */}
          {authState.isAuthenticated ? (
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    {newComment.length}/500
                  </span>
                </div>
              </div>
              <NeumorphicButton
                onClick={handleSubmitComment}
                variant="primary"
                size="sm"
                icon={submitting ? undefined : Send}
                disabled={!newComment.trim() || submitting}
                className="self-start"
              >
                {submitting ? <LoadingSpinner size="sm" /> : null}
              </NeumorphicButton>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-slate-700/20 rounded-2xl text-center">
              <p className="text-slate-400 text-sm">
                {authState.isGuest 
                  ? 'Create an account to join the conversation'
                  : 'Sign in to comment'
                }
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No comments yet</p>
                <p className="text-slate-600 text-sm">Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-slate-700/20 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white truncate">
                        {comment.user?.username || 'Anonymous'}
                        {comment.country ? ` ${comment.country.split(' ').slice(-1)[0]}` : ''}
                      </span>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {new Date(comment.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm break-words">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;