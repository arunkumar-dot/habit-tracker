"use client";

import { MissionCompleteAnimation } from "@/components/rpg/mission-complete-animation";

export function QuestCompleteAnimation(props: Parameters<typeof MissionCompleteAnimation>[0]) {
  return <MissionCompleteAnimation {...props} />;
}
