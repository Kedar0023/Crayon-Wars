import type { AvatarCode } from "../characters/registry";

export type Profile = {
  name: string;
  tag: string;
  avatar: AvatarCode;
};

export type JoinResult = "ok" | "not_found" | "full" | "started";

export const DEFAULT_PROFILE: Profile = {
  name: "PlayerName",
  tag: "#Hj12C3",
  avatar: "52",
};

export const PAGE_BACKGROUNDS = [
  "#FFB0A8",
  "#FFC29B",
  "#FFDF8A",
  "#CDEB9E",
  "#A3E8C4",
  "#A6E1F7",
  "#A9C4FF",
  "#C7B9FF",
  "#FBA6D3",
  "#CBD5E1",
] as const;