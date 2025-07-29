'use client';
import { useState, useEffect } from 'react';
import CardComponent from './components/Card';
import { Card } from '@/types';

export default function HomePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/cards');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch cards');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, []);


  // Filter cards by CNIC
  useEffect(() => {
    const filtered = search 
      ? cards.filter(card => card.cnic.includes(search))
      : cards;
    
    setFilteredCards(filtered);
    
    // Calculate total price
    const total = filtered.reduce((sum, card) => sum + card.totalPayment, 0);
    setTotalPrice(total);
  }, [cards, search]);

  // Delete a card
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      setCards(cards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
   <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
      Card Management System
    </h1>
    
    {/* Search and Controls */}
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by CNIC
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter CNIC number..."
            className="text-black w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="w-full sm:w-auto flex flex-col sm:items-end">
          <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Total Price: <span className="text-blue-600">PKR {totalPrice.toLocaleString()}</span>
          </div>
          <a 
            href="/edit" 
            className="w-full sm:w-auto text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Card
          </a>
        </div>
      </div>
    </div>
    
    {/* Cards Grid */}
    {isLoading ? (
      <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
        <h3 className="text-lg sm:text-xl font-medium text-gray-600">Loading cards...</h3>
        <p className="mt-2 text-sm sm:text-base text-gray-500">Fetching data from server...</p>
      </div>
    ) : filteredCards.length === 0 ? (
      <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
        <h3 className="text-lg sm:text-xl font-medium text-gray-600">
          No cards match your search
        </h3>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          Try a different CNIC number
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCards.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            onDelete={() => handleDelete(card.id)}
          />
        ))}
      </div>
    )}
  </div>
</div>
  );
}