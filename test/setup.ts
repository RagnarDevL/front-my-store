import { config } from '@vue/test-utils'
import { expect } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { beforeAll } from 'vitest'

// Mock global objects
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Initialize Vuetify
const vuetify = createVuetify({
  components,
  directives
})

// Configure Vue Test Utils
config.global.plugins = [vuetify]
config.global.mocks = {
  $t: (msg: string) => msg // i18n mock
}
config.global.stubs = {
  Transition: false,
  'v-col': false,
  'v-row': false,
  // Add other Vuetify components used in your app
  NeuronBackground: true
}

// Setup before all tests
beforeAll(() => {
  // Mock any global functions or APIs here
})

// Add custom matchers
expect.extend({
  // Add any custom matchers here
})
