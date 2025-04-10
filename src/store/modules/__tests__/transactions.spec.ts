/* /// <reference types="vitest" />
import { describe, it, expect } from 'vitest'
import transactions from '../transactions.js'

describe('transactions store module', () => {
  it('has expected initial state', () => {
    expect(transactions.state).toBeDefined()
    expect(typeof transactions.actions).toBe('object')
    expect(typeof transactions.mutations).toBe('object')
  })
})
 */