import { db } from "../drizzle";
import { levelDefinitions } from "../schema/levelDefinitions";

const base = 50;
const rate = 1.05;
let threshold: number;
let polynomialThreshold: number;

export const defineLevelTresholds = async () => {
  for (let i = 1; i <= 20; i++) {
    threshold = Math.floor(base * i ** 1.2);
    await db.insert(levelDefinitions).values({
      level: i,
      xpThreshold: threshold,
    });
  }

  polynomialThreshold = base * 20 ** 1.2;

  for (let i = 21; i <= 100; i++) {
    threshold = Math.floor(base * i ** rate + polynomialThreshold);
    await db.insert(levelDefinitions).values({
      level: i,
      xpThreshold: threshold,
    });
  }
};
