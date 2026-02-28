import { OnboardingAnswers, FocusProfile, FocusProfileType } from '../types/onboarding';

export const calculateFocusScore = (answers: OnboardingAnswers): number => {
  let score = 0;

  // Q5: Capacity (30% weight - max 10 pts)
  const capacityMap: Record<string, number> = { '<10': 0, '10-20': 2, '20-30': 4, '30-45': 6, '45-60': 8, '60+': 10 };
  score += capacityMap[answers.q5_capacity] || 0;

  // Q7: Finish Rate (30% weight - max 10 pts)
  const finishMap: Record<string, number> = { 'rarely': 2, 'sometimes': 4, 'often': 6, 'usually': 8, 'always': 10 };
  score += finishMap[answers.q7_finishRate] || 0;

  // Q9: Flow Freq (30% weight - max 10 pts)
  const flowMap: Record<string, number> = { 'never': 0, 'rarely': 2, 'few-month': 4, 'once-week': 7, 'multiple-week': 10 };
  score += flowMap[answers.q9_flowFreq] || 0;

  // Q10: Phone (25% weight - max 10 pts)
  const phoneMap: Record<string, number> = { 'minutes': 0, '15m': 2, '30m': 4, 'hour': 6, 'few-day': 8, 'away': 10 };
  score += phoneMap[answers.q10_phoneCheck] || 0;

  // Q13: Social (25% weight - max 10 pts)
  const socialMap: Record<string, number> = { 'constant': 0, 'freq': 2, 'occasional': 5, 'rare': 8, 'never': 10 };
  score += socialMap[answers.q13_socialMedia] || 0;

  // Q11: Inbox (25% weight - max 10 pts)
  const inboxMap: Record<string, number> = { '1000+': 0, '200-1000': 2, '50-200': 5, '10-50': 8, '0-10': 10 };
  score += inboxMap[answers.q11_emailVolume] || 0;

  // Q8: Morning (20% weight - max 10 pts)
  const morningMap: Record<string, number> = { 'none': 0, 'loose': 4, 'inconsistent': 6, 'consistent': 10 };
  score += morningMap[answers.q8_morningRoutine] || 0;

  // Q18: Planning (20% weight - max 10 pts)
  const planningMap: Record<string, number> = { 'none': 0, 'reactive': 2, 'mental': 4, 'simple': 7, 'detailed': 10 };
  score += planningMap[answers.q18_planningStyle] || 0;

  // Q16: Breaks (15% weight - max 10 pts)
  const breakMap: Record<string, number> = { 'rarely': 2, 'tired': 5, 'pomodoro': 10, 'micro': 10, 'long': 5 };
  score += breakMap[answers.q16_breakStyle] || 0;

  // Q22: Commitment (10% weight - max 10 pts)
  const commitMap: Record<string, number> = { 'casual': 2, 'curious': 4, 'moderate': 6, 'committed': 8, 'desperate': 10 };
  score += commitMap[answers.q22_commitment] || 0;

  // Normalize to 0-100 (we have 10 categories each max 10 pts)
  return Math.min(100, score);
};

export const getFocusProfile = (score: number): FocusProfile => {
  if (score <= 40) {
    return {
      type: 'scattered_professional',
      name: 'The Scattered Professional',
      score,
      description: 'You have high ambition but struggle significantly with execution due to constant environment and digital switching. You likely feel "busy but unproductive" and end days exhausted with little to show for it.',
      keySignals: 'Focus capacity <10 min, 10+ phone checks/hour, high stress, reactive planning style.',
      trainingTrack: '"Focus Rehab": Starts with 15-minute micro-blocks. Heavy emphasis on environment sanitation and single-tab browsing.',
      coachTone: 'Directive & Simplify. "Do this one thing right now."',
      week1Priority: 'Complete one 15-minute focus block per day without switching screens.',
      color: '#EF4444' // Red
    };
  } else if (score <= 55) {
    return {
      type: 'distracted_achiever',
      name: 'The Distracted Achiever',
      score,
      description: 'You can get things done when deadline pressure hits, but you rely on stress and adrenaline rather than sustainable systems. You suffer from "shiny object syndrome" and often multitask.',
      keySignals: 'Focus capacity 20-30 min, multiple devices, inconsistent routine, motivation driven by fear/deadlines.',
      trainingTrack: '"Structure Builder": Introduces time-blocking and the "Morning Lock-In" to replace adrenaline with ritual.',
      coachTone: 'Encouraging & Structured. "Let\'s channel that energy into a system."',
      week1Priority: 'Perform the Morning Lock-In protocol 3 times.',
      color: '#EAB308' // Gold
    };
  } else if (score <= 70) {
    return {
      type: 'inconsistent_high_performer',
      name: 'The Inconsistent High-Performer',
      score,
      description: 'You have days of brilliance followed by days of fog. You know the concepts of deep work but struggle to maintain them when life gets chaotic or energy dips.',
      keySignals: 'Focus capacity 30-45 min, variable sleep, inconsistent routine, awareness of flow state.',
      trainingTrack: '"Consistency Compounder": Focuses on "bad day management" and energy regulation rather than just productivity peaks.',
      coachTone: 'Analytical & Steady. "Consistency beats intensity."',
      week1Priority: 'Track distractions for 5 days to identify inconsistency patterns.',
      color: '#22C55E' // Green
    };
  } else if (score <= 85) {
    return {
      type: 'deep_work_seeker',
      name: 'The Deep Work Seeker',
      score,
      description: 'You are already organized and disciplined but want to reach the next level of cognitive elite performance. You are looking for optimization, not just repair.',
      keySignals: 'Focus capacity 45-60 min, planned breaks, proactive planning, low phone usage.',
      trainingTrack: '"Optimization Protocol": Advanced techniques like 90-minute blocks, dopamine detoxes, and flow-state triggers.',
      coachTone: 'Challenging & Minimalist. "How can we increase depth by 10%?"',
      week1Priority: 'Complete two 90-minute Deep Work blocks.',
      color: '#3B82F6' // Blue
    };
  } else {
    return {
      type: 'focus_master',
      name: 'The Focus Master',
      score,
      description: 'You operate in the top 1% of cognitive performers. Your challenge isn\'t focusing—it\'s recovery and ensuring you\'re focusing on the right things (effectiveness vs. efficiency).',
      keySignals: 'Focus capacity 60+ min, rigid routines, zero notifications, high flow state frequency.',
      trainingTrack: '"Mastery & Recovery": Emphasis on deliberate rest, strategic thinking, and mentoring others.',
      coachTone: 'Peer/Strategic Partner. "Are we climbing the right mountain?"',
      week1Priority: 'Mentor a user in the Accountability Circle or optimize weekly review.',
      color: '#A855F7' // Purple
    };
  }
};
