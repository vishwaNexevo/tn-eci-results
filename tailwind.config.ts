import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#0f172a', soft: '#334155', muted: '#64748b' },
        paper: { DEFAULT: '#ffffff', soft: '#f8fafc', tint: '#f1f5f9' },
        line: '#e2e8f0',
        brand: { DEFAULT: '#b91c1c', accent: '#0e7490' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        flash: {
          '0%': { backgroundColor: 'rgba(250, 204, 21, 0.35)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.4s ease-in-out infinite',
        flash: 'flash 1.6s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
