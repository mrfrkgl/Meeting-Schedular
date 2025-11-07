
export interface TimeSlot {
  day: string;
  time: string;
}

export interface Submission {
  id: string;
  name: string;
  availability: TimeSlot[];
}
