import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Get all profiles with their works
    const profiles = await db.profile.findMany({
      select: {
        id: true,
        userId: true,
        username: true,
        bio: true,
        profilePicture: true,
        githubUrl: true,
        linkedinUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Fetch works for each profile and apply filters
    const talentsWithWorks = await Promise.all(
      profiles.map(async profile => {
        let workQuery: any = { where: { userId: profile.userId } };

        if (category && category !== 'all') {
          workQuery.where.category = category;
        }

        const works = await db.work.findMany({
          ...workQuery,
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            category: true,
            createdAt: true
          }
        });

        return {
          ...profile,
          profilePicture: profile.profilePicture,
          works: works.slice(0, 3) // Show first 3 works
        };
      })
    );

    // Filter by search if provided
    let results = talentsWithWorks.filter(talent => talent.works.length > 0);

    if (search) {
      results = results.filter(talent =>
        talent.username.toLowerCase().includes(search.toLowerCase()) ||
        talent.bio?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      talents: results,
      total: results.length
    });
  } catch (error: any) {
    console.error('Failed to fetch talents:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch talents' },
      { status: 500 }
    );
  }
}
