export type WorkType = 'corporate' | 'entrepreneur' | 'creative' | 'student' | 'freelancer' | 'healthcare';
export type WorkPlace = 'office' | 'home' | 'coworking' | 'mixed' | 'public' | 'nomad';
export type WorkHours = '4-6' | '6-8' | '8-10' | '10-12' | '12+' | 'varies';
export type StartTime = 'before-7' | '7-9' | '9-11' | '11-2' | 'after-2' | 'none';

export type FocusCapacity = '<10' | '10-20' | '20-30' | '30-45' | '45-60' | '60+';
export type DistractionSource = 'phone' | 'email' | 'social' | 'people' | 'internal' | 'task-switch' | 'noise' | 'hunger' | 'boredom';
export type FinishRate = 'rarely' | 'sometimes' | 'often' | 'usually' | 'always';
export type MorningRoutine = 'consistent' | 'inconsistent' | 'loose' | 'none' | 'not-morning';
export type FlowFrequency = 'multiple-week' | 'once-week' | 'few-month' | 'rarely' | 'never' | 'unknown';

export type PhoneCheckFreq = 'minutes' | '10-15m' | '30m' | 'hour' | 'few-day' | 'away';
export type SocialMediaFreq = 'constant' | 'freq' | 'occasional' | 'rare' | 'never';
export type EmailVolume = '0-10' | '10-50' | '50-200' | '200-1000' | '1000+' | 'unknown';
export type DeviceCount = '1' | '2' | '3' | '4+';

export type PeakEnergy = 'early-morning' | 'late-morning' | 'early-afternoon' | 'late-afternoon' | 'evening' | 'night';
export type SleepHours = '<5' | '5-6' | '6-7' | '7-8' | '8-9' | '9+';
export type BreakStyle = 'pomodoro' | 'tired' | 'rarely' | 'micro' | 'long';
export type WorkIntensity = 'highly-demanding' | 'moderately-demanding' | 'balanced' | 'light' | 'varies';
export type PlanningStyle = 'detailed' | 'simple' | 'mental' | 'none' | 'calendar' | 'reactive';

export type PrimaryReason = 'project' | 'habits' | 'stress' | 'productivity' | 'career' | 'balance';
export type MotivationSource = 'data' | 'community' | 'achievement' | 'fear' | 'rewards' | 'curiosity';
export type CommitmentLevel = 'desperate' | 'committed' | 'moderate' | 'curious' | 'casual';

export type PartnerStatus = 'active' | 'inactive' | 'past' | 'want' | 'solo';
export type SharingComfort = 'public' | 'group' | 'anonymous' | 'private';
export type CoachTone = 'drill' | 'cheerleader' | 'scientist' | 'peer' | 'coach';

export type ReadingProgress = 'none' | 'first-3' | 'half' | 'most' | 'finished' | 'multiple';

export interface OnboardingAnswers {
  // Phase 1
  q1_workType: WorkType;
  q2_workPlace: WorkPlace;
  q3_workHours: WorkHours;
  q4_startTime: StartTime;
  // Phase 2
  q5_capacity: FocusCapacity;
  q6_distractions: DistractionSource[];
  q7_finishRate: FinishRate;
  q8_morningRoutine: MorningRoutine;
  q9_flowFreq: FlowFrequency;
  // Phase 3
  q10_phoneCheck: PhoneCheckFreq;
  q11_emailVolume: EmailVolume;
  q12_deviceCount: DeviceCount;
  q13_socialMedia: SocialMediaFreq;
  // Phase 4
  q14_peakEnergy: PeakEnergy;
  q15_sleepHours: SleepHours;
  q16_breakStyle: BreakStyle;
  q17_workIntensity: WorkIntensity;
  q18_planningStyle: PlanningStyle;
  // Phase 5
  q19_primaryReason: PrimaryReason;
  q20_goal30Days: string;
  q21_motivation: MotivationSource;
  q22_commitment: CommitmentLevel;
  // Phase 6
  q23_partnerStatus: PartnerStatus;
  q24_sharingComfort: SharingComfort;
  q25_coachTone: CoachTone;
  // Phase 7
  q26_readingProgress: ReadingProgress;
  q27_appsTried: string[];
  q28_idealWorkday: string;
}

export type FocusProfileType = 
  | 'scattered_professional' 
  | 'distracted_achiever' 
  | 'inconsistent_high_performer' 
  | 'deep_work_seeker' 
  | 'focus_master';

export interface FocusProfile {
  type: FocusProfileType;
  name: string;
  score: number;
  description: string;
  keySignals: string;
  trainingTrack: string;
  coachTone: string;
  week1Priority: string;
  color: string;
}
