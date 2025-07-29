'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/types';

interface FormData {
  name: string;
  cnic: string; // Changed from number to string to match input
  product: string;
  dateOfIssue: string;
  price: string; // Changed from number to string to handle input
}

export default function EditAddPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cnic: '',
    product: '',
    dateOfIssue: '',
    price: ''
  });
  
  const [daysPassed, setDaysPassed] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isLoading, setIsLoading] = useState(!!id);

  // Calculate days passed and total payment
  useEffect(() => {
    if (!formData.dateOfIssue || !formData.price) return;
    
    const issueDate = new Date(formData.dateOfIssue);
    const today = new Date();
    
    // Calculate time difference in milliseconds
    const timeDiff = today.getTime() - issueDate.getTime();
    
    // Convert time difference to days
    const days = Math.floor((timeDiff  / (1000 * 60 * 60 * 24)) + 1);
    setDaysPassed(days);
    
    // Calculate total payment
    const priceValue = parseFloat(formData.price) || 0;
    const total = (days) * priceValue;
    setTotalPayment(total);
  }, [formData.dateOfIssue, formData.price]);

  // Load card data if editing
 useEffect(() => {
  if (!id) return;
  
  const fetchCard = async () => {
  try {
    const response = await fetch(`/api/cards/${id}`);
    if (!response.ok) throw new Error('Failed to fetch card');
    
    const data: Card = await response.json();
    
    // Robust date handling with silent fallback
    let safeDate = new Date();
    try {
      const parsedDate = new Date(data.dateOfIssue);
      if (!isNaN(parsedDate.getTime())) {
        safeDate = parsedDate;
      }
    } catch {} // Silently fallback to current date
    
    setFormData({
      name: data.name || '',
      cnic: data.cnic?.toString() || '',
      product: data.product || '',
      dateOfIssue: safeDate.toISOString().split('T')[0], // Guaranteed valid format
      price: data.price?.toString() || '0' // Default to '0' if missing
    });

  } catch (error) {
    console.error('Error loading card:', error);
    // Initialize with default valid values
    setFormData({
      name: '',
      cnic: '',
      product: '',
      dateOfIssue: new Date().toISOString().split('T')[0], // Today's date
      price: '0'
    });
  } finally {
    setIsLoading(false);
  }
};
  
  fetchCard();
}, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const cardData = {
      ...formData,
      cnic: formData.cnic, // Keep as string if your Card type expects string
      price: parseFloat(formData.price), // Convert to number for API
      dateOfIssue: new Date(formData.dateOfIssue).toISOString(),
      daysPassed,
      totalPayment
    };
    
    try {
      const url = id ? `/api/cards/${id}` : '/api/cards';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
      });
      
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-600">Loading card data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? 'Edit Card' : 'Add New Card'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Person Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* CNIC input */}
              <div>
                <label htmlFor="cnic" className="block text-sm font-medium text-gray-700 mb-1">
                  CNIC Number
                </label>
                <input
                  type="text"
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                  placeholder="XXXXX-XXXXXXX-X"
                  pattern="\d{5}-\d{7}-\d{1}"
                  title="Please enter CNIC in format: XXXXX-XXXXXXX-X"
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Product input */}
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Price input */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Price (PKR)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Date of Issue input */}
              <div>
                <label htmlFor="dateOfIssue" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Issue
                </label>
                <input
                  type="date"
                  id="dateOfIssue"
                  name="dateOfIssue"
                  value={formData.dateOfIssue}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Calculation display */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Days Passed:</span>
                  <span className="font-medium">{daysPassed}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Total Payment:</span>
                  <span className="font-bold text-lg text-blue-600">
                    PKR {totalPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Form buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {id ? 'Update Card' : 'Add Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}