import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'data.json';
  
  const blob = await put(filename, request.body!, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return NextResponse.json(blob);
}