'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

interface CourseReviewSectionProps {
  courseId: string;
  reviews: Review[];
  avgRating: number;
  ratingCount: number;
  isEnrolled: boolean;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type='button'
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >
          <Star
            className={`h-6 w-6 transition-colors duration-100 ${
              s <= (hover || value) ? 'text-[#c9a96e] fill-[#c9a96e]' : 'text-lux-border fill-lux-border'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className='flex items-center gap-2 text-xs'>
      <span className='text-lux-mid w-4 text-right'>{star}</span>
      <Star className='h-3 w-3 text-gold fill-gold flex-shrink-0' />
      <div className='flex-1 h-1.5 bg-lux-border rounded-full overflow-hidden'>
        <div className='h-full bg-gold rounded-full' style={{ width: `${pct}%` }} />
      </div>
      <span className='text-lux-muted w-8'>{Math.round(pct)}%</span>
    </div>
  );
}

export default function CourseReviewSection({
  courseId, reviews: initial, avgRating, ratingCount, isEnrolled,
}: CourseReviewSectionProps) {
  const { isSignedIn } = useAuth();
  const [reviews, setReviews] = useState(initial);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const starCounts = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/courses/${courseId}/reviews`, { rating, comment });
      setReviews(prev => [res.data, ...prev.filter(r => r.userId !== res.data.userId)]);
      setSubmitted(true);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className='font-display text-2xl font-bold text-lux-black mb-6'>Student Reviews</h2>

      {/* Summary */}
      <div className='flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-lux-bg border border-lux-border'>
        <div className='text-center'>
          <p className='text-6xl font-bold text-lux-black font-display'>{avgRating.toFixed(1)}</p>
          <div className='flex justify-center gap-1 mt-2 mb-1'>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'text-gold fill-gold' : 'text-lux-border fill-lux-border'}`} />
            ))}
          </div>
          <p className='text-xs text-lux-muted'>Course rating</p>
        </div>
        <div className='flex-1 space-y-1.5'>
          {starCounts.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={ratingCount} />
          ))}
        </div>
      </div>

      {/* Write a review */}
      {isEnrolled && isSignedIn && !submitted && (
        <form onSubmit={handleSubmit} className='mb-8 p-6 border border-lux-border bg-white'>
          <h3 className='font-semibold text-lux-black mb-4'>Write a Review</h3>
          <div className='mb-4'>
            <p className='text-sm text-lux-mid mb-2'>Your rating</p>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder='Share your experience with this course...'
            rows={4}
            className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black resize-none focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
          />
          <button
            type='submit'
            disabled={submitting || rating === 0}
            className='mt-3 px-6 py-2.5 bg-lux-black text-white text-sm font-medium hover:bg-lux-dark transition-colors duration-200 disabled:opacity-50'
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}
      {submitted && (
        <div className='mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm'>
          Thank you for your review!
        </div>
      )}

      {/* Reviews list */}
      <div className='space-y-6'>
        {reviews.length === 0 && (
          <p className='text-lux-muted text-sm'>No reviews yet. Be the first to review this course.</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className='flex gap-4'>
            <Avatar className='h-10 w-10 flex-shrink-0'>
              <AvatarFallback className='bg-lux-hover text-lux-mid text-sm font-medium'>
                {review.userId.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <div className='flex gap-0.5'>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-gold fill-gold' : 'text-lux-border fill-lux-border'}`} />
                  ))}
                </div>
                <span className='text-xs text-lux-muted'>
                  {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {review.comment && <p className='text-sm text-lux-mid leading-relaxed'>{review.comment}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
