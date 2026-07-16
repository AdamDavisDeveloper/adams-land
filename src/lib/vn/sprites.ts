export type SpriteDisplay = {
  src: string;
  alt: string;
  flipped: boolean;
} | null;

export type SpritePairState = {
  left: SpriteDisplay;
  right: SpriteDisplay;
};

export const EMPTY_SPRITE_PAIR: SpritePairState = {
  left: null,
  right: null,
};

type SpriteElements = {
  leftSprite: HTMLImageElement;
  rightSprite: HTMLImageElement;
};

const FLIPPED_CLASS = "vn-sprite--flipped";

function applySpriteSlot(
  img: HTMLImageElement,
  prev: SpriteDisplay,
  next: SpriteDisplay,
): void {
  if (next === null) {
    if (!img.hidden) {
      img.hidden = true;
    }
    if (img.classList.contains(FLIPPED_CLASS)) {
      img.classList.remove(FLIPPED_CLASS);
    }
    return;
  }

  if (img.hidden) {
    img.hidden = false;
  }

  if (prev?.src !== next.src) {
    img.src = next.src;
  }

  if (prev?.alt !== next.alt) {
    img.alt = next.alt;
  }

  if (prev?.flipped !== next.flipped) {
    img.classList.toggle(FLIPPED_CLASS, next.flipped);
  }
}

export function applySpritePair(
  elements: SpriteElements,
  current: SpritePairState,
  next: SpritePairState,
): SpritePairState {
  applySpriteSlot(elements.leftSprite, current.left, next.left);
  applySpriteSlot(elements.rightSprite, current.right, next.right);
  return next;
}

export function spritePairForSpeaker(
  side: "left" | "right",
  src: string,
  alt: string,
  flipped: boolean,
): SpritePairState {
  const display: SpriteDisplay = { src, alt, flipped };

  return {
    left: side === "left" ? display : null,
    right: side === "right" ? display : null,
  };
}
