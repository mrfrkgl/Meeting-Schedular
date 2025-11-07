import React, { useState } from 'react';
import { saveSubmission } from '../services/storageService';
import { Submission, TimeSlot } from '../types';
import WeeklyScheduler from './WeeklyScheduler';

const timeSlotKey = (slot: TimeSlot) => `${slot.day}-${slot.time}`;

const UserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSlotClick = (slot: TimeSlot) => {
    const key = timeSlotKey(slot);
    const index = selectedSlots.findIndex(s => timeSlotKey(s) === key);

    let newSlots;
    if (index > -1) {
      newSlots = [...selectedSlots];
      newSlots.splice(index, 1);
    } else {
      newSlots = [...selectedSlots, slot];
    }
    
    setSelectedSlots(newSlots);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Please enter your name.');
      return;
    }

    const newSubmission: Submission = {
      id: crypto.randomUUID(),
      name,
      availability: selectedSlots,
    };
    
    saveSubmission(newSubmission);
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        // Clear form for next user
        setName('');
        setSelectedSlots([]);
    }, 3000); 
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Information</h2>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required 
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">My Availability</h3>
        <p className="text-sm text-gray-600 mb-4">Click on the time slots you are available.</p>
        <WeeklyScheduler
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
        />
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          className="w-full sm:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          disabled={!name}
        >
          {submitted ? 'Saved!' : 'Save & Send Availability'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;