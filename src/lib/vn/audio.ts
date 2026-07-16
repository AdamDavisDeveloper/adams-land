import type { MusicDef } from "./types";

export type SceneAudio = {
  set(music?: MusicDef): void;
  stop(): void;
};

export function createSceneAudio(): SceneAudio {
  let audio: HTMLAudioElement | null = null;

  function stop() {
    if (!audio) return;
    audio.pause();
    audio.src = "";
    audio = null;
  }

  function set(music?: MusicDef) {
    stop();
    if (!music?.src) return;

    audio = new Audio(music.src);
    audio.loop = true;
    audio.volume = music.volume ?? 0.5;

    audio.play().catch(() => {});
  }

  return { set, stop };
}
