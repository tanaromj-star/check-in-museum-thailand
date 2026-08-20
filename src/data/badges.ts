/**
 * Badge definitions and evaluation logic.
 *
 * A Badge is a cross-Museum achievement (distinct from a Stamp, which is
 * per-Museum). Badges are awarded when a Visitor's Stamp collection meets
 * a defined milestone. Evaluation is a pure function: given a set of
 * stamp IDs → list of earned badge IDs.
 *
 * See CONTEXT.md for the Stamp vs Badge distinction.
 */

import { museums } from "./museums";

export interface BadgeDefinition {
  id: string;
  name_thai: string;
  name_english: string;
  description_thai: string;
  description_english: string;
  /** Icon emoji for display */
  icon: string;
  /** The condition that determines if this badge is earned */
  condition: BadgeCondition;
}

export type BadgeCondition =
  | { type: "count"; min: number }
  | { type: "allInProvince"; province: string }
  | { type: "specificMuseums"; museumIds: string[] };

/**
 * Seed badge definitions. At least 3 ship per the spec.
 */
export const badges: BadgeDefinition[] = [
  {
    id: "first-museum",
    name_thai: "ก้าวแรก",
    name_english: "First Steps",
    description_thai: "เยี่ยมชมพิพิธภัณฑ์แห่งแรก",
    description_english: "Visit your first museum",
    icon: "🌱",
    condition: { type: "count", min: 1 },
  },
  {
    id: "five-museums",
    name_thai: "นักสำรวจ",
    name_english: "Explorer",
    description_thai: "เยี่ยมชมพิพิธภัณฑ์ครบ 5 แห่ง",
    description_english: "Visit 5 museums",
    icon: "🧭",
    condition: { type: "count", min: 5 },
  },
  {
    id: "ten-museums",
    name_thai: "นักสะสม",
    name_english: "Collector",
    description_thai: "เยี่ยมชมพิพิธภัณฑ์ครบ 10 แห่ง",
    description_english: "Visit 10 museums",
    icon: "🏆",
    condition: { type: "count", min: 10 },
  },
  {
    id: "all-bangkok",
    name_thai: "รู้จักกรุงเทพ",
    name_english: "Know Bangkok",
    description_thai: "เยี่ยมชมพิพิธภัณฑ์ทุกแห่งในกรุงเทพมหานคร",
    description_english: "Visit all museums in Bangkok",
    icon: "🏙️",
    condition: { type: "allInProvince", province: "Bangkok" },
  },
  {
    id: "all-chiang-mai",
    name_thai: "ชื่นชมล้านนา",
    name_english: "Lanna Lover",
    description_thai: "เยี่ยมชมพิพิธภัณฑ์ทุกแห่งในเชียงใหม่",
    description_english: "Visit all museums in Chiang Mai",
    icon: "🏔️",
    condition: { type: "allInProvince", province: "Chiang Mai" },
  },
];

/**
 * Pure function: given a set of visited museum IDs, return the IDs of
 * all earned badges. This is the core evaluation logic — testable
 * without any UI or hooks.
 */
export function evaluateBadges(visitedMuseumIds: string[]): string[] {
  const visitedSet = new Set(visitedMuseumIds);

  return badges
    .filter((badge) => isConditionMet(badge.condition, visitedSet))
    .map((badge) => badge.id);
}

function isConditionMet(
  condition: BadgeCondition,
  visited: Set<string>,
): boolean {
  switch (condition.type) {
    case "count":
      return visited.size >= condition.min;

    case "allInProvince": {
      const provinceMuseums = museums.filter(
        (m) => m.province_english === condition.province,
      );
      if (provinceMuseums.length === 0) return false;
      return provinceMuseums.every((m) => visited.has(m.id));
    }

    case "specificMuseums":
      return condition.museumIds.every((id) => visited.has(id));
  }
}

/** Get a badge definition by id. */
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return badges.find((b) => b.id === id);
}
