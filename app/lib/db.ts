// lib/db.ts
import fs from 'fs/promises';
import path from 'path';
import { Card } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'cards.json');

// Initialize database file if it doesn't exist
async function initDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify([]), 'utf-8');
  }
}

// Read all cards
export async function getCards(): Promise<Card[]> {
  await initDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Save all cards
async function saveCards(cards: Card[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(cards, null, 2), 'utf-8');
}

// CRUD Operations
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