import {
  MODULES,
  HUMAN_CARDS,
  ROBOT_CARDS,
  BACKGROUNDS,
  PENALTIES,
  type GameSetup,
  type SuspectRole,
} from "./gameData";
import { createRng, pickRandom, pickRandomN } from "./rng";

export function buildGameSetup(roomCode: string): GameSetup {
  const rng = createRng(roomCode);

  const module = pickRandom(rng, MODULES);

  // Select 2 primary + 2 secondary prompts (shuffled together)
  const primary = pickRandomN(rng, module.primaryPrompts, 2);
  const secondary = pickRandomN(rng, module.secondaryPrompts, 2);
  const selectedPrompts = [...primary, ...secondary];

  // Role distribution: ~33% human, ~67% robot
  const rolePick = rng();
  let suspectRole: SuspectRole;
  if (rolePick < 0.33) {
    suspectRole = { kind: "human", card: pickRandom(rng, HUMAN_CARDS) };
  } else {
    suspectRole = { kind: "robot", card: pickRandom(rng, ROBOT_CARDS) };
  }

  const background = pickRandom(rng, BACKGROUNDS);
  const penalty = pickRandom(rng, PENALTIES);

  return { module, selectedPrompts, suspectRole, background, penalty };
}
