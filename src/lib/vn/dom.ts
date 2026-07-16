// This exists to keep the DOM interactions in one place
// and away from the engine. refs are cached once here

export type StageDom = {
  root: HTMLDivElement;

  bgImg: HTMLImageElement;
  darken: HTMLDivElement;

  leftSprite: HTMLImageElement;
  rightSprite: HTMLImageElement;

  textbox: HTMLDivElement;
  name: HTMLDivElement;
  text: HTMLParagraphElement;
  nextCue: HTMLButtonElement;
};

export type CreateStageDomOptions = {
  continueLabel?: string;
};

export function createStageDom(opts: CreateStageDomOptions = {}): StageDom {
  const continueLabel = opts.continueLabel ?? "Continue";

  const root = document.createElement("div");
  root.className = "vn-stage";
  root.tabIndex = 0;

  const bg = document.createElement("div");
  bg.className = "vn-bg";

  const bgImg = document.createElement("img");
  bgImg.className = "vn-bg-image";
  bgImg.alt = "";

  const darken = document.createElement("div");
  darken.className = "vn-bg-darken";

  bg.append(bgImg, darken);

  const sprites = document.createElement("div");
  sprites.className = "vn-sprites";

  const leftSprite = document.createElement("img");
  leftSprite.className = "vn-sprite vn-sprite--left";
  leftSprite.alt = "";
  leftSprite.hidden = true;

  const rightSprite = document.createElement("img");
  rightSprite.className = "vn-sprite vn-sprite--right";
  rightSprite.alt = "";
  rightSprite.hidden = true;

  sprites.append(leftSprite, rightSprite);

  const textbox = document.createElement("div");
  textbox.className = "vn-textbox";

  const content = document.createElement("div");
  content.className = "vn-textbox-content";

  const name = document.createElement("div");
  name.className = "vn-nameplate";

  const text = document.createElement("p");
  text.className = "vn-text";
  text.setAttribute("aria-live", "polite");

  const nextCue = document.createElement("button");
  nextCue.type = "button";
  nextCue.className = "vn-continue";
  nextCue.textContent = continueLabel;

  content.append(name, text);
  textbox.append(content, nextCue);
  root.append(bg, sprites, textbox);

  return { root, bgImg, darken, leftSprite, rightSprite, textbox, name, text, nextCue };
}

export function clearMount(el: Element) {
  while (el.firstChild) el.removeChild(el.firstChild);
}
