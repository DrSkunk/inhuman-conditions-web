// Mulberry32 seeded pseudo-random number generator
function mulberry32(seed: number): () => number {
  return function () {
    seed += 0x6d2b79f5;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash >>> 0;
}

export function createRng(seed: string): () => number {
  return mulberry32(hashString(seed));
}

export function pickRandom<T>(rng: () => number, array: T[]): T {
  return array[Math.floor(rng() * array.length)];
}

export function pickRandomN<T>(rng: () => number, array: T[], n: number): T[] {
  const copy = [...array];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export function generateRoomCode(): string {
  const chars = "23456789abcdefghjkmnpqrstuvwxyz"; // Remove ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
