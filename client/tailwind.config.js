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
          base: '#0D1117',
          surface: '#4D2308',
          raised: '#55443A',
          elevated: '#635046',
          borderSubtle: 'rgba(138, 153, 146, 0.25)',
          borderStrong: '#8A9992',
          amber: '#55443A',
          amberBright: '#8A9992',
          amberDim: '#4D2308',
          rust: '#4D2308',
          rustBright: '#8C5A4A',
          rustDim: '#55443A',
          cool: '#8A9992',
          sage: '#8A9992',
          gold: '#A88452',
          danger: '#8C5A4A',
          textPrimary: '#CFD0CD',
          textSecondary: '#B8BBB7',
          textMuted: '#8A9992'
        },
        soc: {
          void: '#0D1117',
          surface: '#4D2308',
          panel: '#55443A',
          amber: '#55443A',
          cyan: '#8A9992',
          purple: '#4D2308',
          signalGreen: '#8A9992',
          textPrimary: '#CFD0CD',
          textSecondary: '#B8BBB7'
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neu-raised': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'neu-inset': 'inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.02)',
        'glow-primary': '0 0 20px rgba(138, 153, 146, 0.20)',
        'glow-secondary': '0 0 20px rgba(85, 68, 58, 0.35)',
        'glow-cyan': '0 0 20px rgba(138, 153, 146, 0.20)',
        'glow-purple': '0 0 20px rgba(77, 35, 8, 0.35)',
        'glow-green': '0 0 20px rgba(138, 153, 146, 0.20)'
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
          '0%, 100%': { boxShadow: '0 0 4px rgba(138, 153, 146, 0.6)' },
          '50%': { boxShadow: '0 0 14px rgba(138, 153, 146, 0.9)' }
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
