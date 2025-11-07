import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        headerText: '#1F2937',
        subtitleText: '#6B7280',
        cardBorder: '#E5E7EB',
        buttonBg: '#111827'
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        xl: '0.75rem'
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0,0,0,0.08)'
      },
      backgroundImage: {
        'login-gradient': 'linear-gradient(to bottom right, #EFF6FF, #EEF2FF, #FFFFFF)'
      }
    }
  },
  plugins: []
} satisfies Config




