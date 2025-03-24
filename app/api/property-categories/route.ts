
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const subcategories = await db.property.findMany({
      include: {
        pricing: true, 
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        subcategories 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch properties' 
      },
      { status: 500 }
    );
  }
}
