// Vitest setup file (jsdom). Keep minimal.
// You can add custom matchers or polyfills here if needed.

// Example: expose a noop for requestAnimationFrame in jsdom if missing
if (typeof window !== 'undefined' && !('requestAnimationFrame' in window)) {
  // @ts-ignore
  window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
}

