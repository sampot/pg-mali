/**
 * Original lightweight SVG silhouettes (viewBox 32×32).
 * Drawn for this project — not taken from commercial cabinets.
 */

const attrs =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false"';

/** @type {Record<string, string>} path / shape markup inside <svg> */
const PATHS = {
  // Mane circle + face
  lion: `
    <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="16" cy="16" r="6.5" fill="currentColor"/>
    <circle cx="13.5" cy="14.5" r="1.1" fill="#111"/>
    <circle cx="18.5" cy="14.5" r="1.1" fill="#111"/>
    <path d="M13 18.5c1.2 1.4 4.8 1.4 6 0" fill="none" stroke="#111" stroke-width="1.2" stroke-linecap="round"/>
  `,
  // Round head + ear patches
  panda: `
    <circle cx="16" cy="17" r="8" fill="currentColor"/>
    <circle cx="9.5" cy="10" r="3.2" fill="currentColor"/>
    <circle cx="22.5" cy="10" r="3.2" fill="currentColor"/>
    <ellipse cx="12.5" cy="16" rx="2.2" ry="2.6" fill="#111"/>
    <ellipse cx="19.5" cy="16" rx="2.2" ry="2.6" fill="#111"/>
    <ellipse cx="16" cy="19.2" rx="1.4" ry="1" fill="#111"/>
  `,
  // Round head + side ears + smile
  monkey: `
    <circle cx="16" cy="15" r="8" fill="currentColor"/>
    <circle cx="8.5" cy="12" r="3" fill="currentColor"/>
    <circle cx="23.5" cy="12" r="3" fill="currentColor"/>
    <ellipse cx="16" cy="17.5" rx="4.5" ry="3.5" fill="#111" opacity="0.25"/>
    <circle cx="13" cy="14" r="1.1" fill="#111"/>
    <circle cx="19" cy="14" r="1.1" fill="#111"/>
    <path d="M12.5 19c1.5 1.6 5.5 1.6 7 0" fill="none" stroke="#111" stroke-width="1.2" stroke-linecap="round"/>
  `,
  // Tall ears + head
  rabbit: `
    <ellipse cx="11" cy="8" rx="2.4" ry="6.5" fill="currentColor" transform="rotate(-12 11 8)"/>
    <ellipse cx="21" cy="8" rx="2.4" ry="6.5" fill="currentColor" transform="rotate(12 21 8)"/>
    <circle cx="16" cy="18" r="7.5" fill="currentColor"/>
    <circle cx="13.2" cy="17" r="1.1" fill="#111"/>
    <circle cx="18.8" cy="17" r="1.1" fill="#111"/>
    <ellipse cx="16" cy="20.5" rx="1.3" ry="0.9" fill="#111"/>
  `,
  // Spread wings + beak
  eagle: `
    <path d="M4 14c4-1 7 2 8 5 1-4 5-7 12-6-3 3-5 7-5 11H13c0-4-2-8-9-10z" fill="currentColor"/>
    <path d="M15 18l4-2 1.5 2.5L16 21z" fill="currentColor"/>
    <circle cx="18.5" cy="15.5" r="1.1" fill="#111"/>
  `,
  // Fan tail + body
  peacock: `
    <path d="M16 6c-5 4-8 9-8 14 3-1 6-1 8-1s5 0 8 1c0-5-3-10-8-14z" fill="currentColor" opacity="0.85"/>
    <circle cx="10" cy="14" r="1.4" fill="#111"/>
    <circle cx="16" cy="11" r="1.4" fill="#111"/>
    <circle cx="22" cy="14" r="1.4" fill="#111"/>
    <ellipse cx="16" cy="22" rx="4" ry="5" fill="currentColor"/>
    <circle cx="16" cy="20.5" r="1" fill="#111"/>
  `,
  // Simple dove profile
  dove: `
    <ellipse cx="15" cy="17" rx="8" ry="5.5" fill="currentColor"/>
    <path d="M22 15c3-1 5 1 6 3-3 0-5 1-7 2l1-5z" fill="currentColor"/>
    <path d="M8 16c-3 0-5 2-5 2 2 1 4 2 6 2" fill="currentColor"/>
    <circle cx="20" cy="15.5" r="1" fill="#111"/>
    <path d="M23.5 16.5l3 0.5-3 1" fill="#fbbf24"/>
  `,
  // Forked tail swallow
  swallow: `
    <path d="M6 12c5 0 9 3 11 7 2-5 6-8 12-9-4 3-6 7-7 12l-4-2c-1-3-4-6-12-8z" fill="currentColor"/>
    <path d="M16 20l-3 7 4-3 4 3-3-7" fill="currentColor"/>
    <circle cx="22" cy="12.5" r="1" fill="#111"/>
  `,
};

/**
 * @param {string} id
 * @returns {string}
 */
export function iconSvg(id) {
  const inner = PATHS[id] ?? PATHS.lion;
  return `<svg class="icon" ${attrs}>${inner}</svg>`;
}
