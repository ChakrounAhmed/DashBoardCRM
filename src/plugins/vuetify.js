import { createVuetify } from 'vuetify'
import { aliases, mdi }  from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          /* Palette principale ila26 CRM */
          primary:              '#7c3aed',
          'primary-soft':       '#ede9fe',
          'primary-dark':       '#3b0d8c',
          accent:               '#059669',
          'accent-soft':        '#d1fae5',
          success:              '#059669',
          warning:              '#d97706',
          error:                '#dc2626',
          info:                 '#2563eb',
          background:           '#f8f9fb',
          surface:              '#ffffff',
          'on-surface':         '#1e293b',
          'surface-variant':    '#f1f5f9',
          'on-surface-variant': '#64748b',
          secondary:            '#f1f5f9',
          'on-secondary':       '#1e293b',
        },
      },
      dark: {
        colors: {
          primary:              '#a78bfa',
          'primary-soft':       '#2e1065',
          'primary-dark':       '#1e0540',
          accent:               '#34d399',
          'accent-soft':        '#064e3b',
          success:              '#34d399',
          warning:              '#fbbf24',
          error:                '#f87171',
          info:                 '#60a5fa',
          background:           '#0f0e1a',
          surface:              '#1c1a2e',
          'on-surface':         '#e2e8f0',
          'surface-variant':    '#252340',
          'on-surface-variant': '#94a3b8',
          secondary:            '#252340',
          'on-secondary':       '#e2e8f0',
        },
      },
    },
  },
  defaults: {
    VBtn:       { variant: 'flat', rounded: 'lg' },
    VCard:      { rounded: 'xl',  elevation: 0   },
    VTextField: { variant: 'filled', density: 'compact', hideDetails: 'auto' },
    VSelect:    { variant: 'filled', density: 'compact', hideDetails: 'auto' },
  },
})
