export type Side = "left" | "right";

export type CharacterDef = {
  name: string;
  /** Which way the portrait art faces in the source image. */
  spriteFacing: Side;
  portraits: Record<string, string>; // must include "default"
};

export type CharactersMap = Record<string, CharacterDef>;

export type BackgroundDef = {
  src: string;
  blur?: number;   // default 0
  darken?: number; // default 0
};

export type MusicDef = {
  src: string;
  volume?: number; // default 0.5
};

/** Allowed continue-button style variants (map to `.vn-continue--{name}`). */
export const CONTINUE_CLASSES = ["rainbow"] as const;
export type ContinueClass = (typeof CONTINUE_CLASSES)[number];

export type NarratorLine = {
  speaker: null;
  text: string;
  continueLabel?: string; // default "Continue"
  continueClass?: ContinueClass;
};

export type DialogueLine = {
  speaker: string;
  side: Side;
  text: string;
  portrait?: string; // default "default"
  /** Mirror the portrait away from the character's default `facing`. */
  flipped?: boolean; // default false
  continueLabel?: string; // default "Continue"
  continueClass?: ContinueClass;
};

export type Line = NarratorLine | DialogueLine;

export type Scene = {
  id?: string;
  background?: BackgroundDef;
  music?: MusicDef;
  lines: Line[];
};

export type Story = {
  id: string;
  title?: string;
  scenes: Scene[];
};

export type MountVNOptions = {
  storyUrl: string;
  charactersUrl?: string; // default "/vn/characters.json"
  typingMsPerChar?: number; // default 28-ish
};
