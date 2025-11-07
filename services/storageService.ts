
import { Submission } from '../types';

const STORAGE_KEY = 'meetingSubmissions';

export const getSubmissions = (): Submission[] => {
  try {
    const submissionsJson = localStorage.getItem(STORAGE_KEY);
    return submissionsJson ? JSON.parse(submissionsJson) : [];
  } catch (error) {
    console.error("Error retrieving submissions from localStorage", error);
    return [];
  }
};

export const saveSubmission = (newSubmission: Submission): void => {
  try {
    const submissions = getSubmissions();
    // Replace if user with same name submits again
    const existingIndex = submissions.findIndex(s => s.name === newSubmission.name);
    if (existingIndex > -1) {
        submissions[existingIndex] = newSubmission;
    } else {
        submissions.push(newSubmission);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error("Error saving submission to localStorage", error);
  }
};

export const clearSubmissions = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing submissions from localStorage", error);
    }
}
