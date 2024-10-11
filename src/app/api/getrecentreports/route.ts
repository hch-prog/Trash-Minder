import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') ?? '10'); 
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }, 
      take: limit, 
    });


    const formattedReports = reports.map((report) => ({
      ...report,
      createdAt: report.createdAt.toISOString().split('T')[0], 
    }));

    return NextResponse.json(formattedReports, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return NextResponse.json({ error: 'Failed to fetch recent reports' }, { status: 500 });
  }
}

