export type Typewriter = {
  start(text: string): void;
  stop(): void;
  isRunning(): boolean;
  revealAll(): void;
};

export function createTypewriter(target: HTMLElement, msPerChar: number): Typewriter {
  let timer: number | null = null;
  let fullText = "";
  let idx = 0;

  function stop() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start(text: string) {
    stop();
    fullText = text ?? "";
    idx = 0;
    target.textContent = "";
    if (fullText.length === 0) return;

    timer = window.setInterval(() => {
      target.textContent += fullText[idx];
      idx += 1;
      if (idx >= fullText.length) stop();
    }, msPerChar);
  }

  function revealAll() {
    stop();
    target.textContent = fullText;
  }

  return {
    start,
    stop,
    isRunning: () => timer !== null,
    revealAll
  };
}
