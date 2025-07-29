import { NextResponse } from 'next/server';
import { getCard, updateCard, deleteCard } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Note the Promise wrapper
) {
  try {
    const { id } = await params; // Await the params
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const card = await getCard(numericId);
    
    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const updatedData = await request.json();
    
    if (updatedData.dateOfIssue && isNaN(Date.parse(updatedData.dateOfIssue))) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (updatedData.price && typeof updatedData.price !== 'number') {
      return NextResponse.json(
        { error: 'Price must be a number' },
        { status: 400 }
      );
    }

    const updatedCard = await updateCard(numericId, updatedData);
    
    if (!updatedCard) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCard);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const success = await deleteCard(numericId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
