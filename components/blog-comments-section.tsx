'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { MessageCircle, Send, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface BlogCommentsSectionProps {
  slug: string;
  commentCount: number;
}

export default function BlogCommentsSection({ slug, commentCount: initialCount }: BlogCommentsSectionProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    fetch(`/api/blog/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => { setComments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { router.push('/sign-in'); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/blog/${slug}/comments`, { content: newComment.trim() });
      setComments((prev) => [data.comment, ...prev]);
      setCount((c) => c + 1);
      setNewComment('');
    } catch { /* silent */ } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`/api/blog/${slug}/comments`, { data: { commentId } });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCount((c) => c - 1);
    } catch { /* silent */ }
  };

  return (
    <section className='mt-12 pt-8 border-t border-lux-border'>
      <div className='flex items-center gap-2 mb-8'>
        <MessageCircle className='w-5 h-5 text-lux-black' />
        <h3 className='font-display text-xl text-lux-black'>{count} Comment{count !== 1 ? 's' : ''}</h3>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className='mb-10'>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={userId ? 'Share your thoughts...' : 'Sign in to leave a comment'}
          rows={3}
          disabled={!userId}
          className='w-full border border-lux-border bg-lux-bg px-4 py-3 text-sm text-lux-black placeholder:text-lux-muted focus:outline-none focus:border-lux-black transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed'
        />
        <div className='flex justify-end mt-2'>
          {userId ? (
            <button
              type='submit'
              disabled={submitting || !newComment.trim()}
              className='flex items-center gap-2 px-6 py-2.5 bg-lux-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-lux-dark transition-colors disabled:opacity-50'
            >
              {submitting ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Send className='w-3.5 h-3.5' />}
              Post Comment
            </button>
          ) : (
            <a
              href='/sign-in'
              className='flex items-center gap-2 px-6 py-2.5 border border-lux-border text-lux-dark text-xs font-semibold tracking-wider uppercase hover:bg-lux-bg transition-colors'
            >
              Sign In to Comment
            </a>
          )}
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className='flex justify-center py-10'>
          <Loader2 className='w-6 h-6 animate-spin text-lux-muted' />
        </div>
      ) : comments.length === 0 ? (
        <p className='text-lux-muted text-sm text-center py-8'>No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <div className='space-y-6'>
          {comments.map((comment) => (
            <div key={comment.id} className='flex gap-4'>
              <div className='w-9 h-9 rounded-full bg-lux-border flex items-center justify-center text-lux-mid text-xs font-semibold shrink-0'>
                {comment.authorId.slice(0, 2).toUpperCase()}
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='text-xs font-semibold text-lux-dark'>User</p>
                  <div className='flex items-center gap-3'>
                    <span className='text-[11px] text-lux-muted'>
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    {userId === comment.authorId && (
                      <button onClick={() => handleDelete(comment.id)} className='text-lux-muted hover:text-rose-600 transition-colors'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    )}
                  </div>
                </div>
                <p className='text-sm text-lux-black mt-1 leading-relaxed'>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
