// Vuex type shim for Vue 3
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    transactions: {
      transactions: Array<{
        id: string
        amount: number
        date: string
        description: string
        status?: string
      }>
    }
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
