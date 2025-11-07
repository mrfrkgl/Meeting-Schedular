
import React from 'react';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../constants';
import { TimeSlot } from '../types';

interface DisplayData {
  [day: string]: {
    [time: string]: {
      users: { name: string, color: string }[];
      isIntersection: boolean;
    };
  };
}

interface WeeklySchedulerProps {
  selectedSlots?: TimeSlot[];
  onSlotClick?: (slot: TimeSlot) => void;
  isReadOnly?: boolean;
  displayData?: DisplayData;
}

const timeSlotKey = (slot: TimeSlot) => `${slot.day}-${slot.time}`;

const WeeklyScheduler: React.FC<WeeklySchedulerProps> = ({ 
  selectedSlots = [], 
  onSlotClick, 
  isReadOnly = false, 
  displayData 
}) => {
  const selectedKeys = new Set(selectedSlots.map(timeSlotKey));

  const handleSlotClick = (day: string, time: string) => {
    if (!isReadOnly && onSlotClick) {
      onSlotClick({ day, time });
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-[auto_repeat(7,minmax(100px,1fr))] gap-px">
        {/* Header: Time column */}
        <div className="sticky left-0 bg-gray-100 p-2 text-sm font-semibold text-gray-600 z-10 text-center">Time</div>
        
        {/* Header: Day columns */}
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="p-2 text-sm font-semibold text-gray-600 text-center bg-gray-100">{day}</div>
        ))}
        
        {/* Time slots */}
        {TIME_SLOTS.map(time => (
          <React.Fragment key={time}>
            <div className="sticky left-0 bg-gray-100 p-2 text-sm font-semibold text-gray-600 z-10 text-center">{time}</div>
            {DAYS_OF_WEEK.map(day => {
              const currentSlot = { day, time };
              const isSelected = selectedKeys.has(timeSlotKey(currentSlot));
              const cellData = displayData?.[day]?.[time];

              let cellStyle = 'bg-gray-50 hover:bg-gray-200';
              if (isReadOnly) {
                  cellStyle = 'bg-gray-100';
              } else if (isSelected) {
                  cellStyle = 'bg-indigo-500 hover:bg-indigo-600';
              }
              
              const cursorStyle = isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer';

              if (cellData) {
                if (cellData.isIntersection) {
                  return (
                    <div key={day} className="relative p-1 border border-gray-200 bg-emerald-500 text-white flex items-center justify-center font-bold text-xs" title="Common Slot">
                      ALL
                    </div>
                  );
                }
                 if (cellData.users.length > 0) {
                  return (
                    <div key={day} className="relative p-1 border border-gray-200 grid grid-cols-2 gap-px">
                       {cellData.users.map(user => (
                         <div key={user.name} className={`${user.color} rounded-sm text-black text-opacity-70 text-xs truncate px-1`} title={user.name}>
                           {user.name.split(' ')[0]}
                         </div>
                       ))}
                    </div>
                  );
                }
              }

              return (
                <div
                  key={day}
                  onClick={() => handleSlotClick(day, time)}
                  className={`min-h-[40px] border border-gray-200 transition-colors duration-150 ${cellStyle} ${cursorStyle}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklyScheduler;
