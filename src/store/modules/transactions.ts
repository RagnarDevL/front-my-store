import * as CryptoJS from 'crypto-js'

// Helper functions for encryption
export function encryptData(data: string): string {
  if (!import.meta.env.VUE_APP_ENCRYPTION_KEY) {
    console.error('Encryption key not found in environment variables')
  }
  return CryptoJS.AES.encrypt(data, import.meta.env.VUE_APP_ENCRYPTION_KEY).toString()
}

export function decryptData(encryptedData: string): string {
  if (!import.meta.env.VUE_APP_ENCRYPTION_KEY) {
    console.error('Encryption key not found in environment variables')
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.VUE_APP_ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

interface ActionContext {
  commit: (mutation: string, payload?: unknown) => void
  state: TransactionState
}

export enum CardType {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  UNKNOWN = 'unknown'
}

export interface Transaction {
  id: string
  amount: number
  date: string
  description: string
  paymentToken: string
  status?: 'pending'|'completed'|'failed'
}

export interface TransactionState {
  transactions: Transaction[]
  error: string | null
}

const storage = {
  get(): Transaction[] {
    try {
      const data = localStorage.getItem('transactions')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading transactions:', error)
      return []
    }
  },
  set(data: Transaction[]): void {
    try {
      localStorage.setItem('transactions', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving transactions:', error)
    }
  }
}

export default {
  namespaced: true,
  state: (): TransactionState => ({
    transactions: storage.get() || [],
    error: null
  }),
  mutations: {
    ADD_TRANSACTION(state: TransactionState, transaction: Transaction): void {
      try {
        state.transactions.push(transaction)
        storage.set(state.transactions)
        state.error = null
      } catch (error) {
        state.error = 'Failed to add transaction: ' + (error instanceof Error ? error.message : String(error))
      }
    },
    CLEAR_TRANSACTIONS(state: TransactionState): void {
      try {
        state.transactions = []
        storage.set(state.transactions)
        state.error = null
      } catch (error) {
        state.error = 'Failed to clear transactions: ' + (error instanceof Error ? error.message : String(error))
      }
    },
    SET_ERROR(state: TransactionState, error: string | null): void {
      state.error = error
    }
  },
  actions: {
    addTransaction(
      { commit, state }: ActionContext,
      transaction: Transaction
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          commit('ADD_TRANSACTION', transaction)
          if (state.error) {
            throw new Error(state.error)
          }
          resolve()
        } catch (error) {
          commit('SET_ERROR', error instanceof Error ? error.message : String(error))
          reject(error)
        }
      })
    },
    clearTransactions(
      { commit, state }: ActionContext
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          commit('CLEAR_TRANSACTIONS')
          if (state.error) {
            throw new Error(state.error)
          }
          resolve()
        } catch (error) {
          commit('SET_ERROR', error instanceof Error ? error.message : String(error))
          reject(error)
        }
      })
    },
    clearError({ commit }: ActionContext): void {
      commit('SET_ERROR', null)
    }
  },
  getters: {
    getTransactions: (state: TransactionState): Transaction[] => state.transactions,
    getTransactionById: (state: TransactionState) => (id: string): Transaction | undefined => 
      state.transactions.find(t => t.id === id),
    getError: (state: TransactionState): string | null => state.error,
    encryptData: () => (data: string): string => {
      const key = "ClaveSecretaWompi";
      return CryptoJS.AES.encrypt(data, key).toString();
    },
    decryptData: () => (encryptedData: string): string => {
      const key = "ClaveSecretaWompi";
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  }
}
