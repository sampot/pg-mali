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
      <polygon points="11,3 14,10 21,10 15,15 18,22 11,17 4,22 7,15 1,10 8,10" fill="url(#sg)" stroke="#000" stroke-width="0.8"/>
      <polygon points="27,8 29,13 31,13 30,17 31,21 27,19 23,21 24,17 23,13 25,13" fill="url(#sg)" stroke="#000" stroke-width="0.7" transform="scale(0.7) translate(11,2)"/>
    </svg>`,
    watermelon: `<svg viewBox="0 0 32 32" class="icon">
      <path d="M2 27 A14 14 0 0 1 30 27 Z" fill="#E23B3B" stroke="#000" stroke-width="1"/>
      <path d="M2 27 A14 14 0 0 1 30 27" fill="none" stroke="#2E8B57" stroke-width="3.4"/>
      <path d="M2 27 A14 14 0 0 1 30 27" fill="none" stroke="#7CFC00" stroke-width="1.2" opacity="0.8"/>
      <g fill="#1a1a1a">
        <ellipse cx="10" cy="18" rx="1.3" ry="2" transform="rotate(-20 10 18)"/>
        <ellipse cx="16" cy="20" rx="1.3" ry="2" transform="rotate(0 16 20)"/>
        <ellipse cx="22" cy="18" rx="1.3" ry="2" transform="rotate(20 22 18)"/>
        <ellipse cx="13" cy="23" rx="1.3" ry="2" transform="rotate(-10 13 23)"/>
        <ellipse cx="19" cy="23" rx="1.3" ry="2" transform="rotate(10 19 23)"/>
      </g>
    </svg>`,
    bell: `<svg viewBox="0 0 32 32" class="icon">
      <defs><linearGradient id="bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#DAA520"/></linearGradient></defs>
      <path d="M16 3 Q10 3 9 10 L6 22 L26 22 L23 10 Q22 3 16 3Z" fill="url(#bl)" stroke="#000" stroke-width="1.2"/>
      <ellipse cx="16" cy="24" rx="7" ry="2.5" fill="#DAA520" stroke="#000" stroke-width="1"/>
      <circle cx="16" cy="27.5" r="2" fill="#FFD700" stroke="#000" stroke-width="0.8"/>
      <line x1="16" y1="1" x2="16" y2="3" stroke="#000" stroke-width="2"/>
    </svg>`,
    coconut: `<svg viewBox="0 0 32 32" class="icon">
      <path d="M16 4 Q13 0 10 3 Q13 4 15 7 Z" fill="#2E8B57" stroke="#000" stroke-width="0.6"/>
      <path d="M16 4 Q19 0 22 3 Q19 4 17 7 Z" fill="#3CB371" stroke="#000" stroke-width="0.6"/>
      <defs><radialGradient id="cg" cx="40%" cy="32%"><stop offset="0%" stop-color="#6FE08A"/><stop offset="55%" stop-color="#2E8B57"/><stop offset="100%" stop-color="#1f6b3a"/></radialGradient></defs>
      <ellipse cx="16" cy="19" rx="12" ry="9" fill="url(#cg)" stroke="#000" stroke-width="1.3"/>
      <path d="M9 11 Q16 8 23 11 Q16 14 9 11 Z" fill="#7a4a28" stroke="#000" stroke-width="0.8"/>
      <path d="M16 7 Q14 2 17 1" fill="none" stroke="#3CB371" stroke-width="1.4" stroke-linecap="round"/>
      <g stroke="#1f6b3a" stroke-width="0.5" opacity="0.5">
        <line x1="6" y1="17" x2="26" y2="17"/>
        <line x1="5" y1="20" x2="27" y2="20"/>
        <line x1="7" y1="23" x2="25" y2="23"/>
      </g>
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
    cherry: `<svg viewBox="0 0 32 32" class="icon">
      <defs><radialGradient id="cherryg" cx="40%" cy="35%"><stop offset="0%" stop-color="#FF0066"/><stop offset="100%" stop-color="#990033"/></radialGradient></defs>
      <circle cx="12" cy="18" r="8" fill="url(#cherryg)" stroke="#000" stroke-width="1.2"/>
      <circle cx="20" cy="18" r="8" fill="url(#cherryg)" stroke="#000" stroke-width="1.2"/>
      <ellipse cx="12" cy="18" rx="2.7" ry="2.2" fill="#FF6699" opacity="0.4"/>
      <ellipse cx="20" cy="18" rx="2.7" ry="2.2" fill="#FF6699" opacity="0.4"/>
      <path d="M12 10 Q16 2 20 10" fill="#32CD32" stroke="#000" stroke-width="1"/>
      <line x1="16" y1="2" x2="16" y2="10" stroke="#000" stroke-width="1.5"/>
    </svg>`,
    once: `<svg viewBox="0 0 32 32" class="icon">
      <defs><linearGradient id="onceg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7FE0FF"/><stop offset="100%" stop-color="#2E8FE0"/></linearGradient></defs>
      <circle cx="16" cy="16" r="12" fill="url(#onceg)" stroke="#000" stroke-width="1.2"/>
      <path d="M22 13 A7 7 0 1 0 23 18" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
      <polygon points="23,9 27,14 20,14" fill="#fff"/>
      <text x="16" y="30" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">AGAIN</text>
    </svg>`,
  };
  return icons[id] || `<svg viewBox="0 0 32 32" class="icon"><text x="16" y="22" text-anchor="middle" fill="#fff" font-size="16">?</text></svg>`;
}
