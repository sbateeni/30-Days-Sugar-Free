export enum AppView {
  TRACKER = 'TRACKER',
  GUIDE = 'GUIDE',
  SCANNER = 'SCANNER'
}

export interface FoodAnalysis {
  isCompliant: boolean;
  foodName: string;
  sugarContent: string;
  sugarPercentage: string; // e.g., "15%"
  explanation: string;
  macros: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
}

export interface DayStatus {
  day: number;
  completed: boolean;
}

export interface UserProfile {
  height: string;
  startWeight: string;
  currentWeight: string;
}