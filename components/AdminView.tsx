
import React, { useState, useEffect, useMemo } from 'react';
import { getSubmissions, clearSubmissions } from '../services/storageService';
import { Submission, TimeSlot } from '../types';
import { USER_COLORS } from '../constants';
import WeeklyScheduler from './WeeklyScheduler';

const timeSlotKey = (slot: TimeSlot) => `${slot.day}-${slot.time}`;

interface DisplayData {
  [day: string]: {
    [time: string]: {
      users: { name: string, color: string }[];
      isIntersection: boolean;
    };
  };
}

const AdminView: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);
  
  const handleClear = () => {
    if(window.confirm("Are you sure you want to clear all submission data? This cannot be undone.")) {
      clearSubmissions();
      setSubmissions([]);
    }
  }

  const userColorMap = useMemo(() => {
    const map = new Map<string, string>();
    submissions.forEach((sub, index) => {
      map.set(sub.name, USER_COLORS[index % USER_COLORS.length]);
    });
    return map;
  }, [submissions]);

  const analysis = useMemo(() => {
    const displayData: DisplayData = {};
    const slotParticipantMap: Map<string, Submission[]> = new Map();

    const participants = submissions.filter(s => s.availability && s.availability.length > 0);

    participants.forEach(sub => {
      const color = userColorMap.get(sub.name) || 'bg-gray-200';
      (sub.availability || []).forEach(slot => {
        if (!displayData[slot.day]) displayData[slot.day] = {};
        if (!displayData[slot.day][slot.time]) displayData[slot.day][slot.time] = { users: [], isIntersection: false };
        displayData[slot.day][slot.time].users.push({ name: sub.name, color });
        
        const key = timeSlotKey(slot);
        if (!slotParticipantMap.has(key)) {
          slotParticipantMap.set(key, []);
        }
        slotParticipantMap.get(key)?.push(sub);
      });
    });

    const intersectionSlots: TimeSlot[] = [];
    if (participants.length > 0) {
      slotParticipantMap.forEach((users, key) => {
        if (users.length === participants.length) {
          const [day, time] = key.split('-');
          const slot = { day, time };
          intersectionSlots.push(slot);
          displayData[day][time].isIntersection = true;
        }
      });
    }
    
    return { displayData, intersectionSlots, participants };
  }, [submissions, userColorMap]);

  return (
    <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Results</h2>
                <p className="text-sm text-gray-600 mt-1">Review team availability and find the best meeting times.</p>
            </div>
            <button 
                onClick={handleClear}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                Clear All Submissions
            </button>
        </div>

        {submissions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Participants ({submissions.length})</h3>
                <div className="flex flex-wrap gap-4">
                    {submissions.map(sub => (
                        <div key={sub.name} className="flex items-center space-x-2 p-2 rounded-full bg-gray-100">
                            <span className={`block w-4 h-4 rounded-full ${userColorMap.get(sub.name)}`}></span>
                            <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Availability Overview</h3>
            
            {submissions.length > 0 && (
              <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-800">Best Available Slots:</h4>
                  {analysis.intersectionSlots.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 text-blue-700">
                          {analysis.intersectionSlots.map(slot => (
                              <li key={timeSlotKey(slot)}>{slot.day} at {slot.time}</li>
                          ))}
                      </ul>
                  ) : (
                      <p className="mt-2 text-blue-700">No time slots where all participants are available.</p>
                  )}
              </div>
            )}

            <WeeklyScheduler isReadOnly displayData={analysis.displayData} />
        </div>

        {submissions.length === 0 && (
             <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Switch to the User View to add availability.</p>
            </div>
        )}
    </div>
  );
};

export default AdminView;
