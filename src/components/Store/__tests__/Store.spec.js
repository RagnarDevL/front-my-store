import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Store from '../Store.vue'

describe('Store.vue', () => {
  it('renders without errors', () => {
    const wrapper = mount(Store)
    expect(wrapper.exists()).toBe(true)
  })
})
