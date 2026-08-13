/** Colorful Pachislot-style symbol icons (32×32 viewBox). */

/** @param {string} id */
export function iconSvg(id) {
  const icons = {
    bar: `<svg viewBox="0 0 32 32" class="icon">
      <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#B8860B"/></linearGradient></defs>
      <rect x="2" y="9" width="28" height="14" rx="3" fill="url(#bg)" stroke="#000" stroke-width="1.2"/>
      <text x="16" y="20" text-anchor="middle" fill="#000" font-size="7.5" font-weight="bold" stroke="#FFD700" stroke-width="0.3">BAR</text>
    </svg>`,
    double7: `<svg viewBox="0 0 32 32" class="icon">
      <defs><linearGradient id="r7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF4444"/><stop offset="100%" stop-color="#CC0000"/></linearGradient></defs>
      <text x="9" y="25" text-anchor="middle" fill="url(#r7)" font-size="22" font-weight="bold" font-family="serif" stroke="#000" stroke-width="0.8">7</text>
      <text x="24" y="25" text-anchor="middle" fill="url(#r7)" font-size="22" font-weight="bold" font-family="serif" stroke="#000" stroke-width="0.8">7</text>
    </svg>`,
    star: `<svg viewBox="0 0 32 32" class="icon">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFF00"/><stop offset="100%" stop-color="#FFD700"/></linearGradient></defs>
      <polygon points="16,1 20,11 30,11 22,18 25,29 16,23 7,29 10,18 2,11 12,11" fill="url(#sg)" stroke="#000" stroke-width="0.8"/>
    </svg>`,
    watermelon: `<svg viewBox="0 0 32 32" class="icon">
      <path d="M3 28 Q16 1 29 28 Z" fill="#FF4444" stroke="#000" stroke-width="1"/>
      <path d="M3 28 Q16 1 29 28 L29 30 Q16 27 3 30 Z" fill="#228B22" stroke="#000" stroke-width="0.8"/>
      <ellipse cx="12" cy="18" rx="1.8" ry="1.2" fill="#1a1a1a"/>
      <ellipse cx="20" cy="19" rx="1.8" ry="1.2" fill="#1a1a1a"/>
      <ellipse cx="16" cy="24" rx="1.8" ry="1.2" fill="#1a1a1a"/>
      <ellipse cx="16" cy="14" rx="1.8" ry="1.2" fill="#1a1a1a"/>
    </svg>`,
    bell: `<svg viewBox="0 0 32 32" class="icon">
      <defs><linearGradient id="bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#DAA520"/></linearGradient></defs>
      <path d="M16 3 Q10 3 9 10 L6 22 L26 22 L23 10 Q22 3 16 3Z" fill="url(#bl)" stroke="#000" stroke-width="1.2"/>
      <ellipse cx="16" cy="24" rx="7" ry="2.5" fill="#DAA520" stroke="#000" stroke-width="1"/>
      <circle cx="16" cy="27.5" r="2" fill="#FFD700" stroke="#000" stroke-width="0.8"/>
      <line x1="16" y1="1" x2="16" y2="3" stroke="#000" stroke-width="2"/>
    </svg>`,
    coconut: `<svg viewBox="0 0 32 32" class="icon">
      <defs><radialGradient id="cg" cx="40%" cy="35%"><stop offset="0%" stop-color="#DEB887"/><stop offset="100%" stop-color="#8B7355"/></radialGradient></defs>
      <circle cx="16" cy="19" r="11" fill="url(#cg)" stroke="#000" stroke-width="1.2"/>
      <circle cx="12" cy="17" r="1.3" fill="#3a2a1a"/>
      <circle cx="20" cy="17" r="1.3" fill="#3a2a1a"/>
      <circle cx="16" cy="22" r="1.3" fill="#3a2a1a"/>
      <path d="M14 8 Q16 2 18 8" fill="none" stroke="#228B22" stroke-width="2"/>
      <path d="M13 9 Q7 3 14 5" fill="#32CD32" stroke="#000" stroke-width="0.6"/>
      <path d="M19 9 Q25 3 18 5" fill="#32CD32" stroke="#000" stroke-width="0.6"/>
    </svg>`,
    orange: `<svg viewBox="0 0 32 32" class="icon">
      <defs><radialGradient id="og" cx="40%" cy="35%"><stop offset="0%" stop-color="#FFA500"/><stop offset="100%" stop-color="#FF6600"/></radialGradient></defs>
      <circle cx="16" cy="18" r="12" fill="url(#og)" stroke="#000" stroke-width="1.2"/>
      <circle cx="12" cy="14" r="2" fill="#FFA500" opacity="0.5"/>
      <path d="M16 6 Q19 0 25 3 Q21 5 17 7" fill="#32CD32" stroke="#000" stroke-width="0.6"/>
      <line x1="16" y1="6" x2="16" y2="10" stroke="#228B22" stroke-width="1.5"/>
    </svg>`,
    apple: `<svg viewBox="0 0 32 32" class="icon">
      <defs><radialGradient id="ag" cx="35%" cy="30%"><stop offset="0%" stop-color="#FF4444"/><stop offset="100%" stop-color="#CC0000"/></radialGradient></defs>
      <path d="M16 6 Q14 1 18 2" fill="none" stroke="#654321" stroke-width="2"/>
      <path d="M16 7 Q11 2 9 6" fill="#32CD32" stroke="#000" stroke-width="0.5"/>
      <path d="M16 7 Q9 6 6 14 Q3 23 10 27 Q14 30 16 29 Q18 30 22 27 Q29 23 26 14 Q23 6 16 7Z" fill="url(#ag)" stroke="#000" stroke-width="1.2"/>
      <ellipse cx="12" cy="14" rx="3" ry="2.5" fill="#FF6666" opacity="0.4"/>
    </svg>`,
  };
  return icons[id] || `<svg viewBox="0 0 32 32" class="icon"><text x="16" y="22" text-anchor="middle" fill="#fff" font-size="16">?</text></svg>`;
}
