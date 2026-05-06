/**
 * 🎨 Portfolio Theme System
 * Apple tasarım sadeliği + Google kalitesinde animasyonlar
 * Modern Purple Palette | Dark Mode | Glassmorphism
 */

export const theme = {
  colors: {
    // Primary Purple Scale
    purple: {
      50: '#f3e8ff',
      100: '#e2d1f9',
      200: '#c9a9f0',
      300: '#b07ce6',
      400: '#9b51e0',
      500: '#8b3fd9',
      600: '#7c2fc4',
      700: '#6a24a8',
      800: '#531e87',
      900: '#3d1564',
      950: '#1f0a33',
    },
    accent: {
      pink: '#f472b6',
      blue: '#60a5fa',
      cyan: '#22d3ee',
      green: '#34d399',
      amber: '#fbbf24',
    },
    dark: {
      50: '#f8fafc',
      100: '#e2e8f0',
      200: '#cbd5e1',
      300: '#94a3b8',
      400: '#64748b',
      500: '#475569',
      600: '#334155',
      700: '#1e293b',
      800: '#111827',
      900: '#0c0a1a',
      950: '#06040e',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      heavy: 'rgba(255, 255, 255, 0.18)',
      border: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(0, 0, 0, 0.25)',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      muted: '#64748b',
      inverse: '#0c0a1a',
    },
    bg: {
      primary: '#0c0a1a',
      secondary: '#14102a',
      tertiary: '#1c1640',
      elevated: '#221d4a',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #8b3fd9 0%, #f472b6 50%, #60a5fa 100%)',
      purple: 'linear-gradient(135deg, #6a24a8 0%, #8b3fd9 50%, #b07ce6 100%)',
      dark: 'linear-gradient(180deg, #0c0a1a 0%, #14102a 50%, #1c1640 100%)',
      glass: 'linear-gradient(135deg, rgba(139,63,217,0.15) 0%, rgba(244,114,182,0.10) 50%, rgba(96,165,250,0.10) 100%)',
    },
    brand: {
      github: '#333333',
      linkedin: '#0A66C2',
      whatsapp: '#25D366',
      email: '#c770f0',
    },
  },

  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    display: "'Inter Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  fontSizes: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
    xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem',
    '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem', '7xl': '4.5rem',
  },

  fontWeights: {
    light: 300, normal: 400, medium: 500,
    semibold: 600, bold: 700, extrabold: 800,
  },

  spacing: {
    0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
    5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem', 12: '3rem',
    16: '4rem', 20: '5rem', 24: '6rem', 32: '8rem',
  },

  breakpoints: {
    xs: '0px', sm: '576px', md: '768px',
    lg: '992px', xl: '1200px', '2xl': '1400px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    glow: {
      purple: '0 0 20px rgba(139, 63, 217, 0.4), 0 0 40px rgba(139, 63, 217, 0.2)',
      pink: '0 0 20px rgba(244, 114, 182, 0.4), 0 0 40px rgba(244, 114, 182, 0.2)',
      blue: '0 0 20px rgba(96, 165, 250, 0.4), 0 0 40px rgba(96, 165, 250, 0.2)',
    },
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },

  glass: {
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
    },
    navbar: {
      background: 'rgba(12, 10, 26, 0.72)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    },
    modal: {
      background: 'rgba(28, 22, 64, 0.95)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(139, 63, 217, 0.2)',
    },
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    page: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  radius: {
    none: '0', sm: '4px', base: '8px', md: '12px',
    lg: '16px', xl: '20px', '2xl': '24px', full: '9999px',
  },

  animation: {
    fast: '200ms', normal: '400ms', slow: '600ms',
    slower: '800ms', slowest: '1200ms',
  },
}

export const media = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
  motion: `@media (prefers-reduced-motion: no-preference)`,
  reduceMotion: `@media (prefers-reduced-motion: reduce)`,
  dark: `@media (prefers-color-scheme: dark)`,
  light: `@media (prefers-color-scheme: light)`,
}

export const cssVariables = `
  :root {
    --color-purple-50: ${theme.colors.purple[50]};
    --color-purple-100: ${theme.colors.purple[100]};
    --color-purple-200: ${theme.colors.purple[200]};
    --color-purple-300: ${theme.colors.purple[300]};
    --color-purple-400: ${theme.colors.purple[400]};
    --color-purple-500: ${theme.colors.purple[500]};
    --color-purple-600: ${theme.colors.purple[600]};
    --color-purple-700: ${theme.colors.purple[700]};
    --color-purple-800: ${theme.colors.purple[800]};
    --color-purple-900: ${theme.colors.purple[900]};
    --color-purple-950: ${theme.colors.purple[950]};
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-muted: ${theme.colors.text.muted};
    --color-bg-primary: ${theme.colors.bg.primary};
    --color-bg-secondary: ${theme.colors.bg.secondary};
    --color-bg-tertiary: ${theme.colors.bg.tertiary};
    --color-bg-elevated: ${theme.colors.bg.elevated};
    --gradient-primary: ${theme.colors.gradient.primary};
    --gradient-purple: ${theme.colors.gradient.purple};
    --gradient-dark: ${theme.colors.gradient.dark};
    --gradient-glass: ${theme.colors.gradient.glass};
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: ${theme.shadows.glass};
    --glass-blur: 16px;
    --font-primary: ${theme.fonts.primary};
    --font-mono: ${theme.fonts.mono};
    --font-display: ${theme.fonts.display};
    --transition-fast: ${theme.transitions.fast};
    --transition-normal: ${theme.transitions.normal};
    --transition-slow: ${theme.transitions.slow};
    --transition-spring: ${theme.transitions.spring};
    --transition-page: ${theme.transitions.page};
  }
`

export default theme
