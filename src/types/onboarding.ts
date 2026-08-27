export type WorkType = 'corporate' | 'entrepreneur' | 'creative' | 'student' | 'freelancer';
export type FocusCapacity = '<10' | '10-20' | '20-30' | '30-45' | '45-60' | '60+';

export interface OnboardingAnswers {
  workType: WorkType;
  capacity: FocusCapacity;
  goal30Days: string;
}
