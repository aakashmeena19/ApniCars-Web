export function scrollByCard(container: HTMLElement | null, direction: "left" | "right") {
  const firstCard = container?.firstElementChild as HTMLElement | null;
  if (!container || !firstCard) return;

  const gap = Number.parseFloat(window.getComputedStyle(container).columnGap) || 16;
  const step = firstCard.getBoundingClientRect().width + gap;
  container.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
}
