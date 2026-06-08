import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

type Params = { params: { courseId: string } };

export async function POST(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const course = await db.course.findUnique({ where: { id: params.courseId } });
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    if (!course.isPublished) return NextResponse.json({ error: 'Course not available.' }, { status: 400 });

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: params.courseId } },
    });
    if (existing) return NextResponse.json({ enrolled: true, enrollment: existing });

    if (course.isFree || course.price === 0) {
      const enrollment = await db.enrollment.create({
        data: { userId, courseId: params.courseId, paymentStatus: 'free' },
      });
      await db.course.update({
        where: { id: params.courseId },
        data: { enrollmentCount: { increment: 1 } },
      });
      return NextResponse.json({ enrolled: true, enrollment });
    }

    // Paid course → Stripe checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.shortDescription ?? `Enroll in ${course.title}`,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { courseId: params.courseId, userId },
      success_url: `${appUrl}/learn/courses/${params.courseId}?enrolled=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/learn/courses/${params.courseId}`,
    });

    return NextResponse.json({ checkout: true, url: session.url });
  } catch (err) {
    console.error('[ENROLL_POST]', err);
    return NextResponse.json({ error: 'Enrollment failed.' }, { status: 500 });
  }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ enrolled: false });

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: params.courseId } },
      include: { progress: true },
    });
    return NextResponse.json({ enrolled: !!enrollment, enrollment });
  } catch (err) {
    console.error('[ENROLL_GET]', err);
    return NextResponse.json({ enrolled: false });
  }
}
