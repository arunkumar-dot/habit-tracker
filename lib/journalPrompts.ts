const PROMPTS = [
  "What's one thing you noticed about yourself today?",
  "How did your morning routine feel?",
  "What would you do differently tomorrow?",
  "What are you grateful for right now?",
  "What's taking up mental space today?",
  "Did anything surprise you today?",
  "How is your energy compared to yesterday?",
  "What's one small win from today?",
  "What did you learn today?",
  "How are you feeling right now, honestly?",
  "What habit felt easiest today? Why?",
  "What habit felt hardest today? Why?",
  "Is there something you've been avoiding?",
  "What would make tomorrow a good day?",
  "Who made your day better today?",
  "What's one thing you'd tell yesterday's you?",
  "How did your body feel today?",
  "What's something you did just for yourself?",
  "What pattern are you starting to notice?",
  "If today had a title, what would it be?",
  "What moment today felt most like you?",
  "What are you looking forward to tomorrow?",
  "What did you let go of today?",
] as const;

/**
 * Deterministically picks a prompt based on the date string.
 * Same date always returns the same prompt; different dates rotate through.
 */
export function getDailyPrompt(date: string): string {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = ((hash * 31) + date.charCodeAt(i)) >>> 0;
  }
  return PROMPTS[hash % PROMPTS.length];
}
