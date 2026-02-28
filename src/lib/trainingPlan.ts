export interface TrainingPhase {
  week: number;
  phase: number;
  title: string;
  subtitle: string;
  description: string;
  mission: string;
}

export const TRAINING_PLAN: TrainingPhase[] = [
  {
    week: 1,
    phase: 1,
    title: 'The Foundation',
    subtitle: 'Building Your Focus Baseline',
    description: 'This week is about understanding your starting point. You will establish your baseline focus score, identify your core distractions, and set a clear 30-day goal.',
    mission: 'Complete your full Focus Baseline Assessment and share your #1 goal with your AI Coach.'
  },
  {
    week: 2,
    phase: 2,
    title: 'Distraction Defense',
    subtitle: 'Architecting Your Environment',
    description: 'Now we build your fortress. This week focuses on proactively designing your physical and digital environments to eliminate friction and minimize distraction triggers.',
    mission: 'Perform a full "Environment Reset" as described in Chapter 5. Remove or relocate at least 3 common distraction sources.'
  },
  {
    week: 3,
    phase: 3,
    title: 'The Time Block',
    subtitle: 'Mastering Your Calendar',
    description: 'Take control of your time by planning with intention. This week is dedicated to mastering the art of time-blocking to protect your deep work sessions.',
    mission: 'Time-block your entire week in the Smart Daily Planner, ensuring at least one 90-minute Deep Work block each day.'
  },
  {
    week: 4,
    phase: 4,
    title: 'Boundary Building',
    subtitle: 'Protecting Your Focus',
    description: 'Focus is not just about what you do, but what you don\'t do. This week, you will practice setting and enforcing boundaries to protect your time and energy.',
    mission: 'Use three different scripts from the Boundary Vault to decline a meeting, delegate a task, or protect a scheduled Focus Block.'
  },
  {
    week: 5,
    phase: 5,
    title: 'Energy Management',
    subtitle: 'Fueling Your Deep Work',
    description: 'Sustained focus requires managing your energy, not just your time. This week focuses on productive downtime, strategic breaks, and aligning your work with your natural energy cycles.',
    mission: 'Schedule and take a "Productive Downtime" break of at least 30 minutes every day this week, completely disconnected from work.'
  },
  {
    week: 6,
    phase: 6,
    title: 'The Focus Ritual',
    subtitle: 'Automating Your Performance',
    description: 'The final week is about making focus a habit. You will solidify your Morning Lock-In and Evening Shutdown rituals to make high-performance your default state.',
    mission: 'Complete your Morning Lock-In and Evening Shutdown rituals for 5 consecutive days.'
  },
];
