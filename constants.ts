
export const DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TIME_SLOTS: string[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export const USER_COLORS: string[] = [
    'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-purple-200', 'bg-indigo-200', 'bg-teal-200', 'bg-orange-200'
];
