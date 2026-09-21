const paths: Record<string, string> = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.9z"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 8h8M8 12h6"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  map: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/>',
  medical: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v4h6V3M9 12h6M12 9v6"/>',
  cancer: '<path d="M12 3c-2.4 0-4 1.6-4 4 0 2.5 1.7 4.7 4 7 2.3-2.3 4-4.5 4-7 0-2.4-1.6-4-4-4Z"/><path d="m10.5 12-4 8M13.5 12l4 8"/>',
  heartPulse: '<path d="M20.8 4.6c-2-2-5.2-1.9-7.1.2L12 6.5l-1.7-1.7C8.4 2.7 5.2 2.6 3.2 4.6.9 6.9.9 10.6 3.2 13L12 21l8.8-8c2.3-2.4 2.3-6.1 0-8.4Z"/><path d="M3.5 12h4l2-4 3 8 2-4h6"/>',
  surgery: '<path d="m4 19 5-1L19 8l-4-4L5 14l-1 5Z"/><path d="m13 6 4 4M3 21h8"/>',
  tooth: '<path d="M12 3c-2.2-1.2-5-1.1-6.7.6C3.6 5.3 4.2 8 5 10.4c.9 2.8 1.4 8.6 3.2 8.6 1.5 0 1.5-4 3.8-4s2.3 4 3.8 4c1.8 0 2.3-5.8 3.2-8.6.8-2.4 1.4-5.1-.3-6.8C17 1.9 14.2 1.8 12 3Z"/>',
  baby: '<circle cx="12" cy="13" r="7"/><path d="M9 12h.01M15 12h.01M9.5 15c1.2 1 3.8 1 5 0M12 6c0-2 1-3 2.5-3 0 1.7-1 3-2.5 3Z"/>',
  car: '<path d="M5 17h14l1-6-2-5H6l-2 5 1 6Z"/><path d="M7 17v2M17 17v2M6 11h12M8 14h.01M16 14h.01"/>',
  steering: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M3.5 10h17M10.2 13.8 7 20M13.8 13.8 17 20"/>',
  bandage: '<path d="m7.2 4.4 12.4 12.4a2 2 0 0 1-2.8 2.8L4.4 7.2a2 2 0 0 1 2.8-2.8Z"/><path d="m4.4 16.8 12.4-12.4a2 2 0 0 1 2.8 2.8L7.2 19.6a2 2 0 0 1-2.8-2.8Z"/><path d="M10 10h.01M14 14h.01"/>',
  liability: '<path d="M7 21v-2a5 5 0 0 1 10 0v2M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="m17 11 2 2 3-4"/>',
  fire: '<path d="M12 22c4 0 7-2.7 7-6.2 0-4.4-3.6-6.3-3.4-10.8-2.2 1.4-3.5 3.2-3.8 5.2C10.3 8.8 9.6 7 10 5c-3.4 2.2-5 5.8-5 9.3C5 18.6 8.1 22 12 22Z"/><path d="M12 18c1.5 0 2.7-1.1 2.7-2.5 0-1.5-.9-2.4-2-3.4-.2 1.1-.7 1.8-1.5 2.4-.5-.7-.7-1.5-.6-2.3-1.5 1.2-2.2 2.4-2.2 3.5 0 1.3 1.5 2.3 3.6 2.3Z"/>',
  brain: '<path d="M9.5 4.5A3 3 0 0 0 4 6.2v.3a3.2 3.2 0 0 0-1 5.9 3.3 3.3 0 0 0 2 5.8 3 3 0 0 0 4.5 1.3V4.5ZM14.5 4.5A3 3 0 0 1 20 6.2v.3a3.2 3.2 0 0 1 1 5.9 3.3 3.3 0 0 1-2 5.8 3 3 0 0 1-4.5 1.3V4.5Z"/><path d="M7 8h2.5M6 14h3.5M14.5 9H18M14.5 15H17"/>',
  care: '<path d="M12 19s-7-4-7-9a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5-7 9-7 9Z"/><path d="M3 14v4l4 3M21 14v4l-4 3"/>',
  paw: '<circle cx="12" cy="15" r="4"/><circle cx="6.5" cy="10" r="2"/><circle cx="17.5" cy="10" r="2"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/>',
  travel: '<path d="m21 16-8-4V5.5a1.5 1.5 0 0 0-3 0V12l-7 4v2l7-2v3l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-3l8 2v-2Z"/>',
};

export function icon(name: keyof typeof paths, size = 22): string {
  const path = paths[name] ?? paths.spark;
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}
