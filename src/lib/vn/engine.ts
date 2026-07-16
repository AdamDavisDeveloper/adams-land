import type { CharactersMap, MountVNOptions, Story, Line, Side } from "./types";
import { fetchJson } from "./fetchJson";
import { clearMount, createStageDom } from "./dom";
import { createTypewriter } from "./typewriter";
import { createSceneAudio } from "./audio";
import {
  EMPTY_SPRITE_PAIR,
  applySpritePair,
  spritePairForSpeaker,
  type SpritePairState,
} from "./sprites";

export type VNInstance = {
  destroy(): void;
};

type TextboxAlignment = Side | "center";

const DEFAULT_CHARACTERS_URL = "/vn/characters.json";
const TEXTBOX_ALIGNMENTS: TextboxAlignment[] = ["left", "right", "center"];

export async function mountVN(selector: string, opts: MountVNOptions): Promise<VNInstance> {
  const mountEl = document.querySelector(selector);
  if (!mountEl) {
    throw new Error(`mountVN: selector not found: ${selector}`);
  }

  const typingMs = opts.typingMsPerChar ?? 28;

  const [characters, story] = await Promise.all([
    fetchJson<CharactersMap>(opts.charactersUrl ?? DEFAULT_CHARACTERS_URL),
    fetchJson<Story>(opts.storyUrl)
  ]);

  clearMount(mountEl);
  const dom = createStageDom({ continueLabel: opts.continueLabel });
  mountEl.append(dom.root);

  const tw = createTypewriter(dom.text, typingMs);
  const audio = createSceneAudio();

  let sceneIndex = 0;
  let lineIndex = 0;
  let spriteState: SpritePairState = { ...EMPTY_SPRITE_PAIR };

  function getScene() {
    return story.scenes[sceneIndex];
  }

  function applyBackground() {
    const bg = getScene().background;
    if (!bg?.src) {
      dom.bgImg.removeAttribute("src");
      dom.bgImg.style.filter = "";
      dom.darken.style.opacity = "0";
      return;
    }

    dom.bgImg.src = bg.src;
    const blur = bg.blur ?? 0;
    dom.bgImg.style.filter = blur ? `blur(${blur}px)` : "";
    dom.darken.style.opacity = String(bg.darken ?? 0);
  }

  function applyMusic() {
    audio.set(getScene().music);
  }

  function applyTextboxAlignment(alignment: TextboxAlignment) {
    for (const value of TEXTBOX_ALIGNMENTS) {
      dom.textbox.classList.toggle(`vn-textbox--${value}`, value === alignment);
    }
  }

  function renderSpeaker(line: Line) {
    if (!line.speaker) {
      spriteState = applySpritePair(dom, spriteState, EMPTY_SPRITE_PAIR);
      dom.name.textContent = "";
      applyTextboxAlignment("center");
      return;
    }

    const char = characters[line.speaker];
    if (!char) {
      throw new Error(`Unknown speaker "${line.speaker}" (check characters.json)`);
    }

    const portraitKey = line.portrait ?? "default";
    const portraitSrc = char.portraits[portraitKey];

    if (!portraitSrc) {
      throw new Error(`Missing portrait "${portraitKey}" for "${line.speaker}"`);
    }

    spriteState = applySpritePair(
      dom,
      spriteState,
      spritePairForSpeaker(line.side, portraitSrc, char.name),
    );

    dom.name.textContent = char.name;
    applyTextboxAlignment(line.side);
  }

  function renderLine() {
    const scene = getScene();
    const line = scene.lines[lineIndex];

    if (!line) {
      // end of scene
      if (sceneIndex + 1 < story.scenes.length) {
        enterScene(sceneIndex + 1);
      } else {
        endStory();
      }
      return;
    }

    renderSpeaker(line);
    dom.nextCue.style.opacity = "0.5";
    tw.start(line.text);
  }

  function enterScene(nextSceneIndex: number) {
    sceneIndex = nextSceneIndex;
    lineIndex = 0;

    applyBackground();
    applyMusic();
    renderLine();
  }

  function endStory() {
    tw.stop();
    audio.stop();
    dom.nextCue.style.opacity = "0";
    // ?? maybe keep last line; or show "(End.)"
  }

  function advance() {
    if (tw.isRunning()) return; // revealAll() later

    lineIndex += 1;
    renderLine();
  }

  const onClick = () => advance();
  dom.root.addEventListener("click", onClick);

  // Start everything
  enterScene(0);

  return {
    destroy() {
      dom.root.removeEventListener("click", onClick);
      tw.stop();
      audio.stop();
      clearMount(mountEl);
    }
  };
}
