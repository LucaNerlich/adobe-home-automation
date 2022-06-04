/**
 * @jest-environment jsdom
 */
import {sum} from '../index'

// hello world test, delete sooner or later
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
})
