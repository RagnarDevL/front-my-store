import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

// Vuetify configuration
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/lib/styles/main.sass'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)
app.use(store as any) // Temporary Vuex 4 workaround
app.use(vuetify)
app.mount('#app')

// Augment Vue types
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store
  }
}
