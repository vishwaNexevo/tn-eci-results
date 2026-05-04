// Fallback party metadata. Colors from API are preferred; these are used as fallbacks
// and for full names / short labels.
export type PartyMeta = { code: string; short: string; full: string; color: string };

export const PARTY_META: Record<string, PartyMeta> = {
  DMK:      { code: "DMK",      short: "DMK",   full: "Dravida Munnetra Kazhagam",          color: "#E11D2E" },
  ADMK:     { code: "ADMK",     short: "AIADMK",full: "All India Anna Dravida Munnetra Kazhagam", color: "#0B7A3B" },
  AIADMK:   { code: "AIADMK",   short: "AIADMK",full: "All India Anna Dravida Munnetra Kazhagam", color: "#0B7A3B" },
  BJP:      { code: "BJP",      short: "BJP",   full: "Bharatiya Janata Party",             color: "#FF8A1F" },
  INC:      { code: "INC",      short: "INC",   full: "Indian National Congress",           color: "#19AAED" },
  TVK:      { code: "TVK",      short: "TVK",   full: "Tamilaga Vettri Kazhagam",           color: "#E72BD9" },
  NTK:      { code: "NTK",      short: "NTK",   full: "Naam Tamilar Katchi",                color: "#D4AF37" },
  PMK:      { code: "PMK",      short: "PMK",   full: "Pattali Makkal Katchi",              color: "#FFD400" },
  DMDK:     { code: "DMDK",     short: "DMDK",  full: "Desiya Murpokku Dravida Kazhagam",   color: "#1F4E8C" },
  CPI:      { code: "CPI",      short: "CPI",   full: "Communist Party of India",           color: "#C0182B" },
  "CPI(M)": { code: "CPI(M)",   short: "CPI(M)",full: "Communist Party of India (Marxist)", color: "#9B1B1B" },
  VCK:      { code: "VCK",      short: "VCK",   full: "Viduthalai Chiruthaigal Katchi",     color: "#1B4E1B" },
  MDMK:     { code: "MDMK",     short: "MDMK",  full: "Marumalarchi Dravida Munnetra Kazhagam", color: "#E11D2E" },
  IUML:     { code: "IUML",     short: "IUML",  full: "Indian Union Muslim League",         color: "#0B6B3A" },
  AMMKMNKZ: { code: "AMMKMNKZ", short: "AMMK",  full: "Amma Makkal Munnettra Kazhagam",     color: "#10B981" },
  IND:      { code: "IND",      short: "IND",   full: "Independent",                        color: "#6B7280" },
  OTH:      { code: "OTH",      short: "Others",full: "Others",                             color: "#94A3B8" },
};

const FALLBACK_PALETTE = [
  "#7C3AED","#0EA5E9","#F97316","#10B981","#E11D48","#0F766E","#A855F7","#F59E0B",
];

export function partyMeta(code: string, apiColor?: string): PartyMeta {
  const base = PARTY_META[code] ?? PARTY_META[code.toUpperCase()] ?? {
    code,
    short: code,
    full: code,
    color: FALLBACK_PALETTE[Math.abs(hash(code)) % FALLBACK_PALETTE.length],
  };
  return apiColor ? { ...base, color: apiColor } : base;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

// Hex -> rgba with alpha
export function withAlpha(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
