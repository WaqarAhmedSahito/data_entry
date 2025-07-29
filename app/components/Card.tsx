'use client';
import Link from 'next/link';
import { Card as cardtype } from '@/types';

interface CardProps {
  card: cardtype;
  onDelete: () => void;
}

export default function Card({ card, onDelete }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{card.name}</h3>
            <p className="text-sm text-gray-500 mt-1">CNIC: {card.cnic}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
            {card.product}
          </span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Issue Date:</span>
            <span>{new Date(card.dateOfIssue).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Daily Price:</span>
            <span>PKR {card.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Days Passed:</span>
            <span>{card.daysPassed}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Payment:</span>
            <span className="text-lg font-bold text-blue-600">
              PKR {card.totalPayment.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
        <Link 
          href={`/edit?id=${card.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Edit
        </Link>
        <button 
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}