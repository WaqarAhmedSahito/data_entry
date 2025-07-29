import { put, head } from '@vercel/blob';
import { Card } from '@/types';

const BLOB_FILENAME = 'cards.json';

// Initialize database in Blob storage
async function initDB() {
  try {
    await getBlobData();
  } catch {
    await saveBlobData([]);
  }
}

// Helper function to save data to Blob
async function saveBlobData(cards: Card[]) {
  const { url } = await put(BLOB_FILENAME, JSON.stringify(cards), {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return url;
}

// Helper function to get data from Blob
async function getBlobData(): Promise<Card[]> {
  const { url } = await head(BLOB_FILENAME);
  const response = await fetch(url);
  return response.json();
}

// Read all cards
export async function getCards(): Promise<Card[]> {
  await initDB();
  return getBlobData();
}

// Save all cards
async function saveCards(cards: Card[]) {
  await saveBlobData(cards);
}

// CRUD Operations (keep these exactly the same as before)
export async function createCard(card: Omit<Card, 'id'>): Promise<Card> {
  const cards = await getCards();
  const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
  const newCard = { ...card, id: newId };
  await saveCards([...cards, newCard]);
  return newCard;
}

export async function getCard(id: number): Promise<Card | undefined> {
  const cards = await getCards();
  return cards.find(c => c.id === id);
}

export async function updateCard(id: number, updates: Partial<Card>): Promise<Card | undefined> {
  const cards = await getCards();
  const index = cards.findIndex(c => c.id === id);
  
  if (index === -1) return undefined;
  
  const updatedCard = { ...cards[index], ...updates };
  cards[index] = updatedCard;
  await saveCards(cards);
  return updatedCard;
}

export async function deleteCard(id: number): Promise<boolean> {
  const cards = await getCards();
  const initialLength = cards.length;
  const updatedCards = cards.filter(c => c.id !== id);
  
  if (updatedCards.length === initialLength) return false;
  
  await saveCards(updatedCards);
  return true;
}