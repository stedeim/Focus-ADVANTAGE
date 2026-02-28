export interface CircleMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  type: 'member' | 'guide' | 'system';
  reactions?: { emoji: string; count: number }[];
}

export const DAILY_PROMPTS = [
  // Category A: Self-Awareness
  "What time of day do you do your worst work — and are you honest with yourself about protecting your best hours for your most important work?",
  "If you could see a 'heat map' of your focus yesterday, what time of day would be the hottest (most focused) and coldest?",
  "What is your 'Gateway Distraction'—the small one (like checking weather) that usually leads to the big one (scrolling social for 30 mins)?",
  "Are you a 'Sprinter' (short bursts of high intensity) or a 'Marathoner' (steady, lower intensity work)?",
  "When was the last time you were in a true 'Flow State'? What were you working on?",
  
  // Category B: Goals & Progress
  "Read your 30-day goal out loud. Does it still feel exciting, or has it started to feel like a burden? What changed?",
  "Look at your 30-day goal. If you fail, what is the most likely specific reason why? (Let's problem-solve it now).",
  "Why does this goal matter to you as a *person*, not just as a worker/student?",
  "What is one 'micro-win' you've had this week that you haven't celebrated yet?",
  "Is your commitment to your goal based on 'Desire' (it would be nice) or 'Necessity' (I must do this)?",

  // Category C: Struggle & Resilience
  "What's the focus version of 'falling off the wagon' for you — the specific moment when a good focus day starts to unravel?",
  "We all have bad days. What is your 'Emergency Protocol' when your brain just refuses to focus?",
  "Share a 'Failure' from this week. What did it teach you about your system?",
  "What was the hardest moment of your week so far? How did you handle it?",
  "The 'Knowing-Doing Gap': What is one thing you *know* you should do for your productivity but resist doing?",

  // Category D: System & Habit
  "What's one thing in your focus system right now that you'd be embarrassed to admit you haven't been doing consistently?",
  "What is one boundary you've successfully enforced recently? How did it feel?",
  "What does the first 30 minutes of your morning look like? Is it reactive (phone) or proactive (plan)?",
  "Share one tool, app, or physical object that genuinely helps you stay focused.",
  "How can this group support you better? Do you need more tough love or more gentle encouragement right now?"
];

export const MOCK_INITIAL_MESSAGES: CircleMessage[] = [
  {
    id: '1',
    senderId: 'guide',
    senderName: 'Circle Guide',
    text: "Welcome everyone! 🌟 It sounds like we have a powerful mix of goals here—from launching products to reclaiming family time. You are now a team.",
    timestamp: '1:30 PM',
    type: 'guide'
  },
  {
    id: '2',
    senderId: 'guide',
    senderName: 'Circle Guide',
    text: "First Prompt: What's one word that describes how you feel starting this accountability journey?",
    timestamp: '1:31 PM',
    type: 'guide'
  }
];
