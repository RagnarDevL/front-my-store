// Vuex store configuration with type safety
import Vuex from 'vuex'
import transactions from './modules/transactions'
import type { TransactionState } from './modules/transactions'

export interface RootState {
  transactions: TransactionState
}

const store = new Vuex.Store<RootState>({
  modules: {
    transactions
  }
})

export default store
