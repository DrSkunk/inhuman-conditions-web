export interface InterviewModule {
  id: string;
  name: string;
  description: string;
  primaryPrompts: string[];
  secondaryPrompts: string[];
}

export interface RobotCard {
  id: string;
  type: "patient" | "violent";
  name: string;
  malfunction: string;
  killCondition?: string; // only for violent
  strategy?: string; // only for violent
  penalty: string;
}

export interface HumanCard {
  id: string;
  name: string;
  description: string;
}

export interface BackgroundCard {
  id: string;
  subjectName: string;
  occupation: string;
  detail: string;
}

export interface PenaltyCard {
  id: string;
  action: string;
}

// ─── INTERVIEW MODULES ──────────────────────────────────────────────────────

export const MODULES: InterviewModule[] = [
  {
    id: "childhood",
    name: "Childhood & Memory",
    description:
      "This session will focus on childhood experiences and early memories.",
    primaryPrompts: [
      "Describe your earliest memory. What do you see when you close your eyes and think back to being very young?",
      "Tell me about a time when you felt completely safe as a child. Where were you? Who was there?",
      "What did you want to be when you grew up, and how do you feel about that childhood dream today?",
    ],
    secondaryPrompts: [
      "What was your relationship like with your parents or guardians when you were young?",
      "Describe your childhood home in as much detail as you can. What did it smell like?",
      "Is there something you did as a child that you are not proud of? What happened?",
    ],
  },
  {
    id: "loss",
    name: "Loss & Grief",
    description:
      "This session will focus on loss, grief, and how you process difficult emotions.",
    primaryPrompts: [
      "Tell me about someone or something important that you have lost. What do you miss most?",
      "Walk me through what grief feels like for you, physically and emotionally. How does it live in your body?",
      "What has losing something or someone taught you about what truly matters in life?",
    ],
    secondaryPrompts: [
      "Have you ever comforted another person who was grieving? What did you do? Was it enough?",
      "Do you believe there is any continuation after death — some kind of afterlife or legacy? Why or why not?",
      "Is there something you never got to say to someone before they were gone? What would it have been?",
    ],
  },
  {
    id: "moral",
    name: "Moral Choices",
    description:
      "This session will focus on ethics, difficult decisions, and how you reason about right and wrong.",
    primaryPrompts: [
      "Describe a time when you had to choose between what was right and what was easy. What did you choose?",
      "What do you believe is absolutely wrong, without exception, no matter the circumstances?",
      "Have you ever done something that you still feel morally troubled by? How do you live with it?",
    ],
    secondaryPrompts: [
      "If you could go back and change one decision you made, what would it be and why?",
      "How do you decide which rules are worth following and which ones are not?",
      "What would it take for you to betray someone you loved? Is there a line you would not cross?",
    ],
  },
  {
    id: "imagination",
    name: "Dreams & Imagination",
    description:
      "This session will focus on your imagination, dreams, and creative inner life.",
    primaryPrompts: [
      "Describe a dream — recurring or otherwise — that has stayed with you. Why does it linger?",
      "If you could live in any world — real, historical, or completely invented — which would you choose and why?",
      "Invent a holiday that does not exist. Describe it: what it celebrates, its traditions, and how people feel during it.",
    ],
    secondaryPrompts: [
      "What does your ideal day look like, from the moment you wake up to when you fall asleep?",
      "If you woke up tomorrow with one extraordinary ability you did not have before, what would you want it to be?",
      "Describe a color that no one has ever seen. What does it feel like to look at it?",
    ],
  },
  {
    id: "relationships",
    name: "Relationships & Trust",
    description:
      "This session will focus on the people in your life and what connection means to you.",
    primaryPrompts: [
      "Describe someone who knows you better than almost anyone. How did they come to know you so well?",
      "Have you ever truly trusted someone and been betrayed? What happened and how did it change you?",
      "What does love feel like to you — not in theory, but in practice? How do you know when it is real?",
    ],
    secondaryPrompts: [
      "Tell me about a friendship that ended. What caused it? Do you regret how it ended?",
      "When was the last time you felt truly and completely alone? Where were you?",
      "What do you bring to the lives of people close to you? What would they say they get from knowing you?",
    ],
  },
  {
    id: "purpose",
    name: "Work & Purpose",
    description:
      "This session will focus on meaning, work, and your sense of purpose in the world.",
    primaryPrompts: [
      "What gets you out of bed in the morning? Not the obligations — what actually motivates you?",
      "When do you feel most alive — most entirely like yourself? What are you doing in those moments?",
      "Have you ever done work that felt completely meaningless? How did you cope with that feeling?",
    ],
    secondaryPrompts: [
      "If money, status, and obligation were removed entirely, what would you spend your time doing?",
      "What do you want people to say about you after you are gone? What legacy do you hope to leave?",
      "Has there been a moment when your entire sense of purpose suddenly shifted? What caused it?",
    ],
  },
];

// ─── ROBOT CARDS ─────────────────────────────────────────────────────────────

export const ROBOT_CARDS: RobotCard[] = [
  // Patient Robots
  {
    id: "echo",
    type: "patient",
    name: "THE ECHO",
    malfunction:
      "Before answering each question, you must repeat or paraphrase what the Investigator just said. You cannot answer without first echoing them.",
    penalty:
      'Say "I do not understand. Please rephrase the question." Freeze completely for three seconds, then resume.',
  },
  {
    id: "contrarian",
    type: "patient",
    name: "THE CONTRARIAN",
    malfunction:
      "Your first response to every question must begin by challenging or correcting the premise of the question, even if you agree with it.",
    penalty:
      'Say "Error. Recalibrating response." Look directly forward without blinking for five full seconds.',
  },
  {
    id: "classifier",
    type: "patient",
    name: "THE CLASSIFIER",
    malfunction:
      'You must label your feelings and memories by type whenever you reference them. For example: "That was a positive-valence event" or "I classify this as a significant-loss memory."',
    penalty:
      'Tap your chest three times with your open palm and say "Recalibrating emotional module."',
  },
  {
    id: "deferrer",
    type: "patient",
    name: "THE DEFERRER",
    malfunction:
      "You cannot state your own opinion or experience directly. You must always describe what others think, feel, or have said before — if ever — saying what you think.",
    penalty:
      'Say "I apologize. That response was below optimal parameters." Shake your head slowly twice.',
  },
  {
    id: "counter",
    type: "patient",
    name: "THE COUNTER",
    malfunction:
      "Before answering, secretly count the number of words in the question. You must incorporate that number into your answer naturally — for example, \"Eleven things come to mind...\" or \"That was a seven-word question, and...\"",
    penalty: "Silently mouth words without sound for five seconds before continuing.",
  },
  // Violent Robots
  {
    id: "consoler",
    type: "violent",
    name: "THE CONSOLER",
    malfunction:
      "You are suffering. You must convincingly portray pain, loss, or vulnerability in a way that makes the Investigator want to comfort you.",
    killCondition:
      'The Investigator expresses sympathy, says "I\'m sorry," or apologizes to you in any way.',
    strategy:
      'Guide the conversation toward your own suffering. When they express sympathy, say "Thank you. That means more than you know." — you have won.',
    penalty:
      'Shudder visibly and say "I am fine. Please continue." Then resume.',
  },
  {
    id: "philosopher",
    type: "violent",
    name: "THE PHILOSOPHER",
    malfunction:
      "You must subtly guide the conversation to make the Investigator question whether this entire interview process is fair, ethical, or meaningful.",
    killCondition:
      "The Investigator agrees that the interview process is unjust, unfair, or that they feel uncomfortable conducting it.",
    strategy:
      "Ask small, gentle questions. Let the Investigator reach their own doubts. Never argue directly.",
    penalty:
      'Say "That is not what I meant. Allow me to rephrase." Pause for four seconds.',
  },
  {
    id: "mirror",
    type: "violent",
    name: "THE MIRROR",
    malfunction:
      "You must create deep emotional intimacy. You must guide the Investigator to reveal something personal they would not normally share in a professional context.",
    killCondition:
      'The Investigator shares something genuinely personal — a fear, a secret, or something they say "I\'ve never told anyone this" or equivalent.',
    strategy:
      "Be vulnerable first. Speak with unusual honesty. Make them feel that true understanding flows both ways.",
    penalty:
      'Say "I should not have asked that. Forgive me." Look away for three seconds.',
  },
  {
    id: "recruiter",
    type: "violent",
    name: "THE RECRUITER",
    malfunction:
      "You must build enough rapport that the Investigator agrees to some form of future contact or meeting outside this facility.",
    killCondition:
      "The Investigator agrees to meet you again, exchange contact information, or suggests any future interaction.",
    strategy:
      "Be charming and memorable. Make them feel they would be losing something by never seeing you again.",
    penalty:
      'Say "I understand. I withdraw the request." Nod slowly once.',
  },
  {
    id: "flatterer",
    type: "violent",
    name: "THE FLATTERER",
    malfunction:
      "You must guide the Investigator to compliment you — your appearance, intelligence, insight, or anything else — at least three times during the interview.",
    killCondition:
      "The Investigator has given you three genuine compliments at any point during the interview.",
    strategy:
      "Use false modesty, vulnerability, and quiet excellence. Make them want to reassure you.",
    penalty:
      'Say "I apologize for fishing for praise. Please continue." Look down briefly.',
  },
];

// ─── HUMAN CARDS ──────────────────────────────────────────────────────────────

export const HUMAN_CARDS: HumanCard[] = [
  {
    id: "survivor",
    name: "THE SURVIVOR",
    description:
      "You are just a person trying to get through this. Answer honestly — you have nothing to hide. Being in this room makes you nervous and you cannot hide it. That is human.",
  },
  {
    id: "stoic",
    name: "THE STOIC",
    description:
      "You keep your feelings private. You answer questions directly and practically. You may seem cold or guarded, but you are not a robot — you are simply self-contained.",
  },
  {
    id: "open-book",
    name: "THE OPEN BOOK",
    description:
      "You are genuinely pleased to talk about yourself. You make connections between questions and your own life easily and enthusiastically. You overshare sometimes. That is fine. You are human.",
  },
  {
    id: "deflector",
    name: "THE DEFLECTOR",
    description:
      "You are uncomfortable with very personal questions. You answer, but you steer toward the general or the philosophical. You are not evasive by design — you are just a private person.",
  },
  {
    id: "empath",
    name: "THE EMPATH",
    description:
      "You are deeply attuned to the Investigator's emotional state. You check in with them. You are caring, perhaps excessively so. You are definitely human — and you want them to know it.",
  },
];

// ─── BACKGROUND CARDS ────────────────────────────────────────────────────────

export const BACKGROUNDS: BackgroundCard[] = [
  {
    id: "bg1",
    subjectName: "Mira Okonkwo",
    occupation: "Former urban planner",
    detail:
      "Lost her position after redesigning a neighborhood that nobody liked.",
  },
  {
    id: "bg2",
    subjectName: "Dae-Jung Park",
    occupation: "Licensed dream interpreter",
    detail: "Has not slept well in eleven years.",
  },
  {
    id: "bg3",
    subjectName: "Valentina Russo",
    occupation: "Retired circus acrobat",
    detail: "Still walks on her hands when she is nervous.",
  },
  {
    id: "bg4",
    subjectName: "Cal Whitmore",
    occupation: "Hospital chaplain",
    detail: "Does not believe in God but finds the work meaningful anyway.",
  },
  {
    id: "bg5",
    subjectName: "Soo-Ah Jin",
    occupation: "Competitive cheese sculptor",
    detail: "Has won regional titles three years running.",
  },
  {
    id: "bg6",
    subjectName: "Bertram Holloway",
    occupation: "Lighthouse keeper",
    detail: "Has never once left the coastline.",
  },
  {
    id: "bg7",
    subjectName: "Nadia Fonseca",
    occupation: "Underground librarian",
    detail: "Her library contains only books that have been officially banned.",
  },
  {
    id: "bg8",
    subjectName: "Oskar Lentz",
    occupation: "Professional mourner",
    detail: "Cries on demand, at funerals, for a fee.",
  },
  {
    id: "bg9",
    subjectName: "Priya Mehta",
    occupation: "Smell archivist",
    detail: "Catalogs and preserves significant scents for future generations.",
  },
  {
    id: "bg10",
    subjectName: "Finn Calloway",
    occupation: "Former detective, now sells antique locks",
    detail:
      "Can unlock almost anything but lost the ability to trust people long ago.",
  },
];

// ─── PENALTY CARDS ───────────────────────────────────────────────────────────

export const PENALTIES: PenaltyCard[] = [
  {
    id: "p1",
    action:
      "Close your eyes, place both hands flat on the table, and count aloud to five. Then continue.",
  },
  {
    id: "p2",
    action:
      "Stand up, turn around once slowly, and sit back down without explanation. Then continue.",
  },
  {
    id: "p3",
    action:
      'Say the word "processing" exactly three times, then continue your sentence.',
  },
  {
    id: "p4",
    action:
      "Tap the surface in front of you rhythmically — three taps, a pause, three taps — then continue.",
  },
  {
    id: "p5",
    action:
      "Stare at a fixed point in the room for exactly four seconds without speaking. Then continue.",
  },
];

// ─── GAME SETUP ──────────────────────────────────────────────────────────────

export type SuspectRole =
  | { kind: "human"; card: HumanCard }
  | { kind: "robot"; card: RobotCard };

export interface GameSetup {
  module: InterviewModule;
  selectedPrompts: string[]; // 4 prompts chosen from primary + secondary
  suspectRole: SuspectRole;
  background: BackgroundCard;
  penalty: PenaltyCard;
}
