/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/settings.scss'

// Composables
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          "on-surface": '#156F15',
          "on-background": '#156F15',
          background: '#D9C6B7',
          surface: '#CCB19C',
          primary: '#156F15',
          secondary: '#c15e11',
        },
      },
    },
  },
})
