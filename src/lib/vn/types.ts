export type Side = "left" | "right";

export type CharacterDef = {
  name: string;
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

export type NarratorLine = {
  speaker: null;
  text: string;
  continueLabel?: string; // default "Continue"
};

export type DialogueLine = {
  speaker: string;
  side: Side;
  text: string;
  portrait?: string; // default "default"
  continueLabel?: string; // default "Continue"
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
