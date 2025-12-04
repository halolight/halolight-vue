// Vitest setup file
import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
