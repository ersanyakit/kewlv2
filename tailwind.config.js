/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#d9e7ff',
          200: '#bcd5ff',
          300: '#8ebaff',
          400: '#5895ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        success: {
          500: '#10b981',
        },
        error: {
          500: '#ef4444',
        },
        neutral: {
          bg: '#f3f4f6',
          'dark-bg': '#111827',
        },
        kewl: {
          primary: {
            light: '#3b82f6',
            dark: '#1d4ed8',
            DEFAULT: '#3b82f6',
          },
          secondary: {
            light: '#60a5fa',
            dark: '#2563eb',
            DEFAULT: '#60a5fa',
          },
          accent: {
            light: '#f0f9ff',
            dark: '#172554',
            DEFAULT: '#f0f9ff',
          },
        },
        ui: {
          background: {
            primary: {
              light: 'rgba(255, 255, 255, 0.8)',
              dark: 'rgba(31, 41, 55, 0.8)',
            },
            secondary: {
              light: 'rgba(249, 250, 251, 0.5)',
              dark: 'rgba(31, 41, 55, 0.5)',
            },
            tertiary: {
              light: 'rgba(243, 244, 246, 0.3)',
              dark: 'rgba(31, 41, 55, 0.3)',
            },
          },
          panel: {
            light: 'rgba(255, 255, 255, 0.8)',
            dark: 'rgba(31, 41, 55, 0.8)',
          },
          input: {
            light: 'rgba(249, 250, 251, 0.8)',
            dark: 'rgba(55, 65, 81, 0.5)',
          },
          border: {
            light: 'rgba(229, 231, 235, 0.5)',
            dark: 'rgba(75, 85, 99, 0.5)',
          },
        },
        status: {
          warning: '#f59e0b',
          info: '#3b82f6',
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 6px 24px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'button': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'token': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'token-hover': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'token-tap': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      },
      animation: {
        'float': 'float 15s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-once': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) 1',
        'bounce-light': 'bounce 2s infinite ease',
        'ping-once': 'ping 0.5s cubic-bezier(0, 0, 0.2, 1) 1',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-15px)' },
          '75%': { transform: 'translateY(20px) translateX(15px)' },
        },
        shimmer: {
          '0%, 100%': { transform: 'translateX(-150%)' },
          '50%': { transform: 'translateX(150%)' },
        },
        'ping-once': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'primary-gradient-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.card'),
          '.dark &': {
            backgroundColor: theme('colors.gray.800'),
          },
        },
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 300ms ease',
        },
        '.btn-primary': {
          backgroundColor: theme('colors.kewl.primary.DEFAULT'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.kewl.primary.dark'),
          },
        },
      })
    }
  ],
};