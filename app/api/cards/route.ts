import { NextResponse } from 'next/server';
import { createCard, getCards } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const newCardData = await request.json();

    // Validation
    if (!newCardData.name || !newCardData.cnic || !newCardData.product || 
        !newCardData.dateOfIssue || !newCardData.price) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const newCard = await createCard(newCardData);
    return NextResponse.json(newCard, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cards = await getCards();
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}