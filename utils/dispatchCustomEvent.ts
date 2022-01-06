export function dispatchCustomEvent(name: string, payload: unknown): void {
  const event = new CustomEvent(name, { detail: payload });

  document.dispatchEvent(event);
}
