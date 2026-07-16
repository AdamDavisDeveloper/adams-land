export type SpriteDisplay = {
  src: string;
  alt: string;
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

function applySpriteSlot(
  img: HTMLImageElement,
  prev: SpriteDisplay,
  next: SpriteDisplay,
): void {
  if (next === null) {
    if (!img.hidden) {
      img.hidden = true;
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
): SpritePairState {
  const display: SpriteDisplay = { src, alt };

  return {
    left: side === "left" ? display : null,
    right: side === "right" ? display : null,
  };
}
