export type Side = "left" | "right";

export type CharacterDef = {
  name: string;
  side: Side;
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

export type Line = {
  speaker: string | null; // null = narrator
  text: string;
  portrait?: string;      // default "default"
  side?: Side;            // default from character
};

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
