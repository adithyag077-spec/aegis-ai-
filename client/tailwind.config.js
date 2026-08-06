/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dune: {
          base: '#0d0b08',
          surface: '#17130e',
          raised: '#1f1a13',
          elevated: '#262016',
          borderSubtle: '#34291b',
          borderStrong: '#4a3823',
          amber: '#d98a3d',
          amberBright: '#f0a355',
          amberDim: '#a8672c',
          rust: '#b3542e',
          rustBright: '#d1693a',
          rustDim: '#7a3a1f',
          cool: '#5b7a75',
          sage: '#8a9a5b',
          gold: '#d9a441',
          danger: '#a83b2e',
          textPrimary: '#f2e8d8',
          textSecondary: '#b8a892',
          textMuted: '#6e6151'
        },
        soc: {
          void: '#0d0b08',
          surface: '#17130e',
          panel: '#17130e',
          amber: '#d98a3d',
          cyan: '#d98a3d',
          purple: '#b3542e',
          signalGreen: '#8a9a5b',
          textPrimary: '#f2e8d8',
          textSecondary: '#b8a892'
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neu-raised': '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.025)',
        'neu-inset': 'inset 6px 6px 12px rgba(0, 0, 0, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.025)',
        'glow-primary': '0 0 24px rgba(217, 138, 61, 0.35)',
        'glow-secondary': '0 0 24px rgba(179, 84, 46, 0.30)',
        'glow-cyan': '0 0 24px rgba(217, 138, 61, 0.35)',
        'glow-purple': '0 0 24px rgba(179, 84, 46, 0.30)',
        'glow-green': '0 0 24px rgba(138, 154, 91, 0.35)'
      },
      borderRadius: {
        'neu-sm': '12px',
        'neu-md': '16px',
        'neu-lg': '20px',
        'neu-xl': '28px'
      },
      animation: {
        'radar-rotate': 'radarRotate 20s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'status-pulse': 'statusPulse 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 10s ease infinite',
      },
      keyframes: {
        radarRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.4)', opacity: '0' }
        },
        statusPulse: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(138, 154, 91, 0.6)' },
          '50%': { boxShadow: '0 0 14px rgba(138, 154, 91, 0.9)' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    },
  },
  plugins: [],
}
